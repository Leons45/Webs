// Leon's Banner Builder – ChatGPT Content Script
// Runs on chatgpt.com — automates file upload, prompt, and image capture

(function () {
  'use strict';

  let started = false;

  // Listen for the trigger from the background worker
  window.addEventListener('leons_start_automation', () => {
    if (started) return;
    started = true;
    setTimeout(startAutomation, 1500);
  });

  // Also try on load in case the event was missed
  window.addEventListener('load', () => {
    setTimeout(() => {
      chrome.storage.local.get(['leons_status'], (data) => {
        if (data.leons_status === 'pending' && !started) {
          started = true;
          setTimeout(startAutomation, 2000);
        }
      });
    }, 3000);
  });

  async function startAutomation() {
    try {
      // Load data from storage
      const data = await storageGet(['leons_flyer', 'leons_sample', 'leons_prompt', 'leons_status']);
      if (!data.leons_flyer || !data.leons_sample || !data.leons_prompt) {
        setError('Missing upload data in storage.');
        return;
      }
      if (data.leons_status !== 'pending') return; // already running or done

      // Convert base64 data URLs to Blobs
      const flyerBlob  = dataURLtoBlob(data.leons_flyer);
      const sampleBlob = dataURLtoBlob(data.leons_sample);
      const flyerFile  = new File([flyerBlob],  'leons-flyer.png',  { type: flyerBlob.type });
      const sampleFile = new File([sampleBlob], 'leons-sample.png', { type: sampleBlob.type });

      setStatus('uploading');
      await sleep(1000);

      // Try to find and trigger the file upload
      const uploaded = await uploadFiles([flyerFile, sampleFile]);
      if (!uploaded) {
        setError('Could not find ChatGPT file upload. Please try manually attaching the files and use the copied prompt.');
        await copyPromptToClipboard(data.leons_prompt);
        return;
      }

      await sleep(2000);

      // Type the prompt
      setStatus('prompting');
      const sent = await typeAndSend(data.leons_prompt);
      if (!sent) {
        setError('Could not send prompt to ChatGPT. It may have been copied to clipboard instead.');
        await copyPromptToClipboard(data.leons_prompt);
        return;
      }

      // Wait for image generation
      setStatus('waiting');
      const imageUrl = await waitForGeneratedImage(180000); // 3 min timeout

      if (!imageUrl) {
        setError('Image generation timed out or was not detected. Check the ChatGPT tab.');
        return;
      }

      // Store result
      await storageSet({ leons_result: imageUrl, leons_status: 'done' });

    } catch (err) {
      setError('Automation error: ' + err.message);
    }
  }

  // ── File Upload ──────────────────────────────────────────────────────────────

  async function uploadFiles(files) {
    // Strategy 1: Find the file input directly
    let fileInput = document.querySelector('input[type="file"]');

    // Strategy 2: Click the attachment button to reveal the input
    if (!fileInput) {
      const attachBtn = findAttachButton();
      if (attachBtn) {
        attachBtn.click();
        await sleep(800);
        fileInput = document.querySelector('input[type="file"]');
      }
    }

    if (fileInput) {
      try {
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        Object.defineProperty(fileInput, 'files', { value: dt.files, writable: true });
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(1500);
        return true;
      } catch (e) {
        console.warn('[Leons] File input injection failed:', e);
      }
    }

    // Strategy 3: Drop onto the input area
    const dropTarget = findInputArea();
    if (dropTarget) {
      try {
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        dropTarget.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
        await sleep(300);
        dropTarget.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
        await sleep(1500);
        return true;
      } catch (e) {
        console.warn('[Leons] Drop failed:', e);
      }
    }

    // Strategy 4: Paste images via clipboard API
    try {
      const clipItems = files.map(f => ({ [f.type]: f }));
      const clipboardItems = clipItems.map(obj => new ClipboardItem(obj));
      await navigator.clipboard.write(clipboardItems);
      const inputArea = findInputArea();
      if (inputArea) {
        inputArea.focus();
        document.execCommand('paste');
        await sleep(1500);
        return true;
      }
    } catch (e) {
      console.warn('[Leons] Clipboard paste failed:', e);
    }

    return false;
  }

  function findAttachButton() {
    // Common selectors for ChatGPT's attach/paperclip button
    const selectors = [
      'button[aria-label*="Attach"]',
      'button[aria-label*="attach"]',
      'button[aria-label*="file"]',
      'button[aria-label*="File"]',
      'button[data-testid*="attach"]',
      'button[data-testid*="file"]',
      '[title*="Attach"]',
      '[title*="attach"]',
      // The paperclip icon button
      'button svg path[d*="M15.172"]', // paperclip path
    ];
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          // If we got an SVG path, return its closest button
          return el.tagName === 'BUTTON' ? el : el.closest('button');
        }
      } catch (e) {}
    }
    // Fallback: look for buttons with paperclip-like icons
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => {
      const svg = b.querySelector('svg');
      if (!svg) return false;
      const d = svg.innerHTML || '';
      return d.includes('M15.172') || d.includes('paperclip') ||
             (b.getAttribute('aria-label') || '').toLowerCase().includes('attach');
    }) || null;
  }

  function findInputArea() {
    const selectors = [
      '#prompt-textarea',
      '[data-id="prompt-textarea"]',
      '[contenteditable="true"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="message"]',
      'div[role="textbox"]',
      'div[contenteditable]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // ── Type & Send ───────────────────────────────────────────────────────────────

  async function typeAndSend(text) {
    const inputArea = findInputArea();
    if (!inputArea) return false;

    inputArea.focus();
    await sleep(300);

    // For contenteditable divs
    if (inputArea.contentEditable === 'true') {
      // Clear existing content
      inputArea.innerHTML = '';
      // Insert text
      const textNode = document.createTextNode(text);
      inputArea.appendChild(textNode);
      inputArea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // For textareas
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(inputArea, text);
      inputArea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    await sleep(500);

    // Try to find and click the send button
    const sent = await clickSendButton();
    if (!sent) {
      // Fallback: press Enter
      inputArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      await sleep(300);
    }

    return true;
  }

  async function clickSendButton() {
    const selectors = [
      'button[aria-label="Send prompt"]',
      'button[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      'button[type="submit"]',
    ];
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn && !btn.disabled) {
        btn.click();
        await sleep(500);
        return true;
      }
    }
    // Fallback: find enabled submit-like button near the textarea
    const buttons = Array.from(document.querySelectorAll('button'));
    const sendBtn = buttons.find(b => {
      if (b.disabled) return false;
      const label = (b.getAttribute('aria-label') || b.textContent || '').toLowerCase();
      return label.includes('send') || label.includes('submit');
    });
    if (sendBtn) { sendBtn.click(); return true; }
    return false;
  }

  // ── Wait for Generated Image ──────────────────────────────────────────────────

  async function waitForGeneratedImage(timeoutMs) {
    const start = Date.now();
    // Track images that existed before we sent the prompt
    const knownImages = new Set(
      Array.from(document.querySelectorAll('img')).map(i => i.src)
    );

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const imgs = Array.from(document.querySelectorAll(
          'img[src*="oaidalleapiprodscus"], img[src*="dalle"], img[src*="oaidallee"], ' +
          'img[src*="production-files"], img[src*="cdn.openai.com"], ' +
          'button[aria-label*="Download"] ~ img, ' +
          '.message-content img, [data-message-author-role="assistant"] img'
        ));

        // Also scan all images for new large ones
        const allImgs = Array.from(document.querySelectorAll('img'));
        const newLargeImgs = allImgs.filter(img => {
          if (knownImages.has(img.src)) return false;
          if (!img.src || img.src.startsWith('data:') && img.src.length < 1000) return false;
          const rect = img.getBoundingClientRect();
          return (rect.width > 300 || img.naturalWidth > 300);
        });

        const candidates = [...imgs, ...newLargeImgs];

        for (const img of candidates) {
          const src = img.src || img.getAttribute('src');
          if (!src || knownImages.has(src)) continue;
          if (src.includes('chatgpt') && src.length > 50) continue; // Skip UI images

          // This looks like a generated image
          observer.disconnect();
          resolve(src);
          return;
        }

        if (Date.now() - start > timeoutMs) {
          observer.disconnect();
          resolve(null);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
      });

      // Also poll every 5 seconds as fallback
      const pollInterval = setInterval(() => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(pollInterval);
          observer.disconnect();
          resolve(null);
          return;
        }
        // Check for download button which appears after generation
        const downloadBtn = document.querySelector(
          'button[aria-label*="Download"], button[title*="Download"], a[download]'
        );
        if (downloadBtn) {
          // Try to get the nearby image
          const imgEl = downloadBtn.closest('[data-message-author-role="assistant"]')
                       ?.querySelector('img') || document.querySelector('.dalle-image img');
          if (imgEl && imgEl.src && !knownImages.has(imgEl.src)) {
            clearInterval(pollInterval);
            observer.disconnect();
            resolve(imgEl.src);
          }
        }
      }, 5000);
    });
  }

  // ── Utilities ─────────────────────────────────────────────────────────────────

  function dataURLtoBlob(dataURL) {
    const [header, base64] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function storageGet(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  }

  function storageSet(obj) {
    return new Promise(resolve => chrome.storage.local.set(obj, resolve));
  }

  function setStatus(status) {
    chrome.storage.local.set({ leons_status: status });
  }

  function setError(msg) {
    chrome.storage.local.set({ leons_status: 'error', leons_error: msg });
  }

  async function copyPromptToClipboard(prompt) {
    try {
      await navigator.clipboard.writeText(prompt);
      console.log('[Leons] Prompt copied to clipboard as fallback.');
    } catch (e) {}
  }

})();
