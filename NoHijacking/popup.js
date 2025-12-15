/**
 * NoHijacking - Popup Script
 * Displays statistics and activity log
 */

// Load and display log
function loadLog() {
  chrome.runtime.sendMessage({ type: 'GET_LOG' }, (response) => {
    if (!response || !response.log) return;

    const log = response.log;

    // Update statistics
    const hijackingCount = log.filter(entry => entry.type === 'hijacking').length;
    const preventedCount = log.filter(entry => entry.type === 'paste_prevented').length;

    document.getElementById('hijackingCount').textContent = hijackingCount;
    document.getElementById('preventedCount').textContent = preventedCount;

    // Display log entries
    const logContainer = document.getElementById('logContainer');

    if (log.length === 0) {
      logContainer.innerHTML = `
        <div class="empty-log">
          <div class="empty-log-icon">✅</div>
          <p>No threats detected yet!</p>
          <p style="font-size: 11px; margin-top: 5px;">Your clipboard is safe.</p>
        </div>
      `;
      return;
    }

    // Show most recent first
    const recentLog = log.slice().reverse().slice(0, 20);

    logContainer.innerHTML = recentLog.map(entry => {
      const date = new Date(entry.timestamp);
      const timeStr = date.toLocaleTimeString();
      const url = new URL(entry.url).hostname;

      if (entry.type === 'hijacking') {
        return `
          <div class="log-entry hijacking">
            <div class="log-time">🚨 ${timeStr}</div>
            <div class="log-url">${url}</div>
            <div>Clipboard was modified!</div>
            <div class="log-content">
              <strong>Original:</strong><br>
              ${escapeHtml(entry.original.substring(0, 100))}...
            </div>
            <div class="log-content">
              <strong>Modified:</strong><br>
              ${escapeHtml(entry.modified.substring(0, 100))}...
            </div>
          </div>
        `;
      } else {
        return `
          <div class="log-entry prevented">
            <div class="log-time">✅ ${timeStr}</div>
            <div class="log-url">${url}</div>
            <div>Dangerous paste prevented</div>
            <div class="log-content">
              ${escapeHtml(entry.content.substring(0, 150))}...
            </div>
          </div>
        `;
      }
    }).join('');
  });
}

/**
 * Clear log
 */
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Clear all activity logs?')) {
    chrome.runtime.sendMessage({ type: 'CLEAR_LOG' }, (response) => {
      if (response.success) {
        loadLog();
      }
    });
  }
});

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load log on popup open
loadLog();

// Refresh every 2 seconds
setInterval(loadLog, 2000);
