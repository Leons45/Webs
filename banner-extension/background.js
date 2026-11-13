// Leon's Banner Builder – Service Worker (Background)

let watchedTabId = null;

// Listen for popup messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'watchTab') {
    watchedTabId = msg.tabId;
    sendResponse({ ok: true });
  }
});

// When a watched tab completes loading, inject the content script trigger
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId !== watchedTabId) return;
  if (changeInfo.status !== 'complete') return;
  if (!tab.url || !tab.url.includes('chatgpt.com')) return;

  // Small delay to let React hydrate
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Signal the content script to start automation
        window.dispatchEvent(new CustomEvent('leons_start_automation'));
      }
    });
  }, 2500);
});
