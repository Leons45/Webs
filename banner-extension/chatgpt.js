// Leon's Banner Builder – ChatGPT Content Script v2
// Strategy: show helper overlay, pre-fill prompt, detect when user attaches files & sends

(function () {
  'use strict';

  let started = false;

  window.addEventListener('leons_start_automation', () => {
    if (started) return;
    started = true;
    setTimeout(startAutomation, 2000);
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      chrome.storage.local.get(['leons_status'], (data) => {
        if (data.leons_status === 'pending' && !started) {
          started = true;
          setTimeout(startAutomation, 2500);
        }
      });
    }, 3000);
  });

  async function startAutomation() {
    const data = await storageGet(['leons_prompt', 'leons_flyer_name', 'leons_sample_name', 'leons_status']);
    if (!data.leons_prompt || data.leons_status !== 'pending') return;

    const flyerName  = data.leons_flyer_name  || 'leons-flyer-upload.png';
    const sampleName = data.leons_sample_name || 'leons-sample-upload.png';

    // Pre-fill the prompt in ChatGPT's input
    await sleep(1500);
    await fillPrompt(data.leons_prompt);

    // Show the helper overlay
    showHelperOverlay(flyerName, sampleName, data.leons_prompt);

    // Set status so popup shows "attach files" step
    setStatus('uploading');

    // Watch for the user sending the message (both images attached + sent)
    watchForSend();
  }

  // ── Fill Prompt ───────────────────────────────────────────────────────────────

  async function fillPrompt(text) {
    const inputArea = findInputArea();
    if (!inputArea) return;

    inputArea.focus();
    await sleep(300);

    if (inputArea.contentEditable === 'true') {
      inputArea.innerHTML = '';
      const textNode = document.createTextNode(text);
      inputArea.appendChild(textNode);
      inputArea.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } else {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(inputArea, text);
      inputArea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // ── Helper Overlay ────────────────────────────────────────────────────────────

  function showHelperOverlay(flyerName, sampleName, prompt) {
    // Remove any existing overlay
    const existing = document.getElementById('leons-helper');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'leons-helper';
    el.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      width: 320px;
      background: #111;
      border: 2px solid #FFC107;
      border-radius: 14px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      overflow: hidden;
    `;

    el.innerHTML = `
      <div style="background:#FFC107;padding:12px 14px 8px;display:flex;align-items:center;justify-content:space-between;">
        <div style="font-weight:900;font-size:15px;color:#111;letter-spacing:-0.5px;">LEON'S Banner Builder</div>
        <button id="leons-close" style="background:none;border:none;cursor:pointer;font-size:16px;color:#111;padding:0 2px;">✕</button>
      </div>
      <div style="padding:14px;">
        <div style="font-size:13px;color:#FFC107;font-weight:700;margin-bottom:10px;">📎 Step 1 — Attach these 2 files</div>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Files saved to your <strong style="color:#fff;">Downloads</strong> folder:</div>
          <div style="font-size:12px;color:#66BB6A;padding:4px 0;display:flex;align-items:center;gap:6px;">🖼️ ${flyerName}</div>
          <div style="font-size:12px;color:#66BB6A;padding:4px 0;display:flex;align-items:center;gap:6px;">📐 ${sampleName}</div>
        </div>
        <div style="font-size:11px;color:#888;margin-bottom:12px;line-height:1.5;">
          Click the <strong style="color:#fff;">📎 paperclip</strong> in ChatGPT → select both files from Downloads → then click Send.
        </div>
        <div style="font-size:13px;color:#FFC107;font-weight:700;margin-bottom:8px;">✏️ Step 2 — Prompt is ready</div>
        <div style="font-size:11px;color:#888;margin-bottom:10px;">The prompt has been pre-filled in the chat box below.</div>
        <button id="leons-copy-prompt" style="
          width:100%;padding:9px;background:#222;color:#ccc;
          border:1px solid #444;border-radius:8px;cursor:pointer;
          font-size:12px;font-weight:600;transition:background 0.15s;
        ">📋 Copy Prompt to Clipboard</button>
        <div id="leons-waiting" style="display:none;margin-top:10px;font-size:11px;color:#888;text-align:center;">
          ⏳ Waiting for DALL-E to generate your banner…
        </div>
      </div>
    `;

    document.body.appendChild(el);

    document.getElementById('leons-close').onclick = () => el.remove();

    document.getElementById('leons-copy-prompt').onclick = async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        document.getElementById('leons-copy-prompt').textContent = '✓ Copied!';
        setTimeout(() => {
          const btn = document.getElementById('leons-copy-prompt');
          if (btn) btn.textContent = '📋 Copy Prompt to Clipboard';
        }, 2000);
      } catch (e) {}
    };
  }

  function showWaitingState() {
    const waiting = document.getElementById('leons-waiting');
    if (waiting) waiting.style.display = 'block';
    const overlay = document.getElementById('leons-helper');
    if (overlay) {
      const title = overlay.querySelector('div[style*="Step 1"]');
      const title2 = overlay.querySelector('div[style*="Step 2"]');
      if (title)  title.textContent  = '✓ Files sent!';
      if (title2) title2.textContent = '⏳ Generating banner…';
    }
  }

  // ── Watch For Send ────────────────────────────────────────────────────────────

  function watchForSend() {
    // Track images present before generation
    const knownImages = new Set(
      Array.from(document.querySelectorAll('img')).map(i => i.src)
    );

    // Watch for the response to appear (new assistant message with an image)
    const observer = new MutationObserver(() => {
      // Check if user has sent (new human message appeared)
      const msgs = document.querySelectorAll('[data-message-author-role="user"]');
      if (msgs.length > 0) {
        setStatus('prompting');
        showWaitingState();
        setStatus('waiting');
      }

      // Look for generated image in assistant response
      const allImgs = Array.from(document.querySelectorAll('img'));
      for (const img of allImgs) {
        const src = img.src || '';
        if (knownImages.has(src)) continue;
        if (!src || src.length < 50) continue;

        // Skip tiny UI images
        if (img.width < 100 && img.naturalWidth < 100) {
          knownImages.add(src); // mark as known
          continue;
        }

        // Skip known ChatGPT UI patterns
        if (src.includes('gravatar') || src.includes('openai.com/favicon') ||
            src.includes('profile') || src.includes('avatar')) {
          knownImages.add(src);
          continue;
        }

        // This looks like the generated banner
        // Could be a blob URL, oaidallee URL, or production files URL
        if (src.startsWith('blob:') || src.includes('oaidallee') ||
            src.includes('production-files') || src.includes('cdn.openai.com') ||
            (img.naturalWidth > 400 && img.naturalHeight > 100)) {
          observer.disconnect();
          captureImage(img);
          return;
        }

        knownImages.add(src);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'naturalWidth']
    });

    // Polling fallback every 4s — look for download buttons or large new images
    let pollCount = 0;
    const poll = setInterval(() => {
      pollCount++;
      if (pollCount > 90) { // 6 min timeout
        clearInterval(poll);
        observer.disconnect();
        setError('Timed out waiting for image generation. Check ChatGPT manually.');
        return;
      }

      // Look for download button that appears after DALL-E generates
      const downloadBtns = document.querySelectorAll(
        'button[aria-label*="Download"], a[download], button[title*="Download"]'
      );
      for (const btn of downloadBtns) {
        const container = btn.closest('[data-message-author-role="assistant"]') ||
                          btn.closest('.message') || btn.parentElement;
        if (!container) continue;
        const img = container.querySelector('img');
        if (img && img.src && !knownImages.has(img.src) && img.src.length > 50) {
          clearInterval(poll);
          observer.disconnect();
          captureImage(img);
          return;
        }
      }

      // Also scan for any large new image directly
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        if (knownImages.has(img.src)) continue;
        if (!img.src || img.src.length < 50) { knownImages.add(img.src); continue; }
        const w = img.naturalWidth || img.width || 0;
        const h = img.naturalHeight || img.height || 0;
        if (w > 500 && h > 150) {
          clearInterval(poll);
          observer.disconnect();
          captureImage(img);
          return;
        }
        knownImages.add(img.src);
      }
    }, 4000);
  }

  function captureImage(imgEl) {
    const src = imgEl.src;
    setStatus('done');
    storageSet({ leons_result: src, leons_status: 'done' });

    // Update overlay
    const overlay = document.getElementById('leons-helper');
    if (overlay) {
      overlay.style.borderColor = '#4CAF50';
      overlay.innerHTML = `
        <div style="background:#4CAF50;padding:12px 14px 8px;display:flex;align-items:center;justify-content:space-between;">
          <div style="font-weight:900;font-size:15px;color:#fff;">✓ Banner Generated!</div>
          <button onclick="this.closest('#leons-helper').remove()" style="background:none;border:none;cursor:pointer;font-size:16px;color:#fff;padding:0 2px;">✕</button>
        </div>
        <div style="padding:14px;font-size:13px;color:#aaa;">
          <div style="color:#66BB6A;margin-bottom:8px;">The animator is opening in a new tab…</div>
          <div style="font-size:11px;">You can now close this ChatGPT tab.</div>
        </div>
      `;
    }
  }

  // ── Utilities ─────────────────────────────────────────────────────────────────

  function findInputArea() {
    const selectors = [
      '#prompt-textarea',
      '[data-id="prompt-textarea"]',
      '[contenteditable="true"]',
      'div[role="textbox"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="message"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function storageGet(keys) { return new Promise(r => chrome.storage.local.get(keys, r)); }
  function storageSet(obj)  { return new Promise(r => chrome.storage.local.set(obj, r)); }
  function setStatus(s)     { chrome.storage.local.set({ leons_status: s }); }
  function setError(msg)    { chrome.storage.local.set({ leons_status: 'error', leons_error: msg }); }

})();
