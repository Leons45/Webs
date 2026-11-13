// Leon's Banner Builder – Popup Script

const state = { flyerData: null, sampleData: null };

// ── File Upload Handlers ──────────────────────────────────────────────────────

function setupUpload(inputId, boxId, labelId, nameId, stateKey) {
  const input = document.getElementById(inputId);
  const box   = document.getElementById(boxId);
  const label = document.getElementById(labelId);
  const name  = document.getElementById(nameId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      state[stateKey] = e.target.result; // base64 data URL
      box.classList.add('has-file');
      label.textContent = '✓ ' + (stateKey === 'flyerData' ? 'Flyer' : 'Sample');
      label.classList.add('ok');
      name.textContent = file.name.length > 24 ? file.name.substring(0, 22) + '…' : file.name;
    };
    reader.readAsDataURL(file);
  });
}

setupUpload('flyerInput',  'flyerBox',  'flyerLabel',  'flyerName',  'flyerData');
setupUpload('sampleInput', 'sampleBox', 'sampleLabel', 'sampleName', 'sampleData');

// ── UI Helpers ────────────────────────────────────────────────────────────────

function showStatus(msg, type = 'info') {
  const bar  = document.getElementById('statusBar');
  const text = document.getElementById('statusText');
  bar.className  = 'status-bar show' + (type === 'error' ? ' error' : type === 'success' ? ' success' : '');
  text.textContent = msg;
}

function setStep(n) {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('step' + i);
    if (!el) continue;
    el.className = 'step-item' + (i < n ? ' done' : i === n ? ' active' : '');
  }
}

function g(id) { return document.getElementById(id).value.trim(); }

// ── Build Prompt ──────────────────────────────────────────────────────────────

function buildPrompt() {
  const product   = g('productName');
  const price     = g('salePrice');
  const save      = g('saveAmount');
  const pct       = g('pctOff');
  const campaign  = g('campaign');
  const fin       = g('finOpt');
  const fine      = g('finePrint');

  return `You are a graphic design expert creating a retail promotional banner for Leon's Furniture.

I am attaching TWO images:
1. The Leon's Black Friday FLYER — this is the source of the brand style: the exact black and white circles, Leon's logo, Santa Claus graphic, decorative stars, and colour scheme.
2. A SAMPLE BANNER — this shows the exact layout format and dimensions I want.

TASK: Create a horizontal promotional banner (1200×400px) that:
- Replicates the EXACT same circle layout from the flyer (large black circle left, large white circle right with black border)
- Keeps the Leon's logo, Santa Claus, stars, and all decorative elements from the flyer
- Replaces the product and pricing information with the new details below
- Matches the typography style (bold condensed sans-serif, red/yellow accents)
- Uses the same colour palette (#111 background, #FFC107 yellow, #DC143C red, white)

PRODUCT DETAILS TO SHOW:
- Product: ${product || 'Featured Product'}
- Sale Price: ${price || 'ON SALE'}
- Savings: ${save || ''}
- Discount: ${pct || ''}
- Campaign: ${campaign || 'Black Friday'}
- Financing: ${fin || ''}
- Fine Print: ${fine || ''}

LAYOUT RULES (follow the sample banner structure exactly):
- Left circle: Leon's logo top-left, Santa Claus figure on the left side
- Center: product name, sale price (large), savings badge
- Right circle: financing option text ("${fin || '3 YEARS TO PAY*'}") split across 2 lines, percentage badge
- Keep all decorative elements (stars, borders, red accent bar at bottom)

Output: A single high-quality 1200×400px PNG banner image ready for digital use. No variations, just one perfect banner.`;
}

// ── Generate Flow ─────────────────────────────────────────────────────────────

document.getElementById('btnGenerate').addEventListener('click', async () => {
  if (!state.flyerData) {
    showStatus('⚠️ Please upload the Leon\'s flyer first.', 'error');
    return;
  }
  if (!state.sampleData) {
    showStatus('⚠️ Please upload a sample banner for reference.', 'error');
    return;
  }

  const btn = document.getElementById('btnGenerate');
  btn.disabled = true;
  document.getElementById('btnText').textContent = 'Generating…';
  document.getElementById('stepsTrack').classList.add('show');

  const prompt = buildPrompt();

  // Store everything in chrome.storage for the content script
  await chrome.storage.local.set({
    leons_flyer:   state.flyerData,
    leons_sample:  state.sampleData,
    leons_prompt:  prompt,
    leons_status:  'pending',
    leons_result:  null
  });

  // Step 1: Open ChatGPT
  setStep(1);
  showStatus('Opening ChatGPT…');

  const tab = await chrome.tabs.create({ url: 'https://chatgpt.com/', active: true });

  // Tell background to watch this tab
  chrome.runtime.sendMessage({
    action: 'watchTab',
    tabId: tab.id
  });

  // Step 2: Wait for content script to signal ready, then step through
  let stepInterval = null;
  let lastStatus   = '';

  function pollStatus() {
    chrome.storage.local.get(['leons_status', 'leons_step', 'leons_result', 'leons_error'], (data) => {
      if (data.leons_error) {
        clearInterval(stepInterval);
        showStatus('❌ ' + data.leons_error, 'error');
        btn.disabled = false;
        document.getElementById('btnText').textContent = 'Try Again';
        return;
      }

      const st = data.leons_status || '';
      if (st === lastStatus) return;
      lastStatus = st;

      if (st === 'uploading') { setStep(2); showStatus('Uploading images to ChatGPT…'); }
      else if (st === 'prompting') { setStep(3); showStatus('Sending banner prompt…'); }
      else if (st === 'waiting')   { setStep(4); showStatus('Waiting for DALL-E generation (1–3 min)…'); }
      else if (st === 'done')      {
        clearInterval(stepInterval);
        setStep(5);
        showStatus('Banner generated! Opening animator…', 'success');

        // Open animator with the result
        const resultUrl = data.leons_result;
        const animUrl = chrome.runtime.getURL('animator/animator.html') + '?src=' + encodeURIComponent(resultUrl);
        chrome.tabs.create({ url: animUrl, active: true });

        setTimeout(() => {
          btn.disabled = false;
          document.getElementById('btnText').textContent = 'Generate Banner';
          document.getElementById('stepsTrack').classList.remove('show');
          document.getElementById('statusBar').classList.remove('show');
        }, 4000);
      }
    });
  }

  stepInterval = setInterval(pollStatus, 1000);
});

// Listen for messages from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'stepUpdate') {
    setStep(msg.step);
    if (msg.text) showStatus(msg.text);
  }
});
