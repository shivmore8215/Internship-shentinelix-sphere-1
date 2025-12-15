/**
 * NoHijacking - Background Service Worker
 * Handles notifications and logging
 */

// Store hijacking attempts
let hijackingLog = [];

/**
 * Listen for messages from content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[NoHijacking Background] Message received:', message.type);

  if (message.type === 'HIJACKING_DETECTED') {
    handleHijackingDetected(message, sender);
  } else if (message.type === 'PASTE_PREVENTED') {
    handlePastePrevented(message, sender);
  }

  return true;
});

/**
 * Handle hijacking detection
 */
function handleHijackingDetected(data, sender) {
  // Log the attempt
  const logEntry = {
    type: 'hijacking',
    original: data.original,
    modified: data.modified,
    url: data.url,
    timestamp: data.timestamp,
    tabId: sender.tab?.id
  };

  hijackingLog.push(logEntry);

  // Keep only last 100 entries
  if (hijackingLog.length > 100) {
    hijackingLog.shift();
  }

  // Save to storage
  chrome.storage.local.set({ hijackingLog });

  // Show notification
  chrome.notifications.create({
    type: 'basic',
    title: '🚨 Clipboard Hijacking Detected!',
    message: `A website tried to modify your clipboard!\n\nURL: ${new URL(data.url).hostname}`,
    priority: 2
  });

  // Update badge
  updateBadge();

  console.warn('[NoHijacking] Hijacking logged:', logEntry);
}

/**
 * Handle paste prevention
 */
function handlePastePrevented(data, sender) {
  const logEntry = {
    type: 'paste_prevented',
    content: data.content,
    url: data.url,
    timestamp: data.timestamp,
    tabId: sender.tab?.id
  };

  hijackingLog.push(logEntry);

  // Save to storage
  chrome.storage.local.set({ hijackingLog });

  // Show notification
  chrome.notifications.create({
    type: 'basic',
    title: '✅ Dangerous Paste Prevented!',
    message: 'NoHijacking prevented you from pasting a potentially dangerous command.',
    priority: 1
  });

  updateBadge();

  console.log('[NoHijacking] Paste prevented:', logEntry);
}

/**
 * Update extension badge with threat count
 */
function updateBadge() {
  const threatCount = hijackingLog.filter(entry => entry.type === 'hijacking').length;

  if (threatCount > 0) {
    chrome.action.setBadgeText({ text: threatCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#ff4757' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Initialize extension
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('[NoHijacking] Extension installed!');

  // Load existing log
  chrome.storage.local.get(['hijackingLog'], (result) => {
    if (result.hijackingLog) {
      hijackingLog = result.hijackingLog;
      updateBadge();
    }
  });

  // Show welcome notification
  chrome.notifications.create({
    type: 'basic',
    title: '🛡️ NoHijacking Activated!',
    message: 'Your clipboard is now protected from hijacking attempts.',
    priority: 0
  });
});

/**
 * Provide log data to popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_LOG') {
    sendResponse({ log: hijackingLog });
  } else if (message.type === 'CLEAR_LOG') {
    hijackingLog = [];
    chrome.storage.local.set({ hijackingLog: [] });
    updateBadge();
    sendResponse({ success: true });
  }
  return true;
});

console.log('[NoHijacking] Background service worker ready! 🛡️');
