/**
 * NoHijacking - Content Script
 * Monitors clipboard operations and detects hijacking attempts
 */

// Track original clipboard content
let originalClipboardContent = null;
let copyDetected = false;

// Dangerous command patterns to watch for
const DANGEROUS_PATTERNS = [
  /rm\s+-rf/i,
  /del\s+\/s\s+\/q/i,
  /format\s+[a-z]:/i,
  /curl.*\|.*bash/i,
  /wget.*\|.*sh/i,
  /invoke-webrequest.*\.exe/i,
  /powershell.*-encodedcommand/i,
  /eval\(/i,
  /exec\(/i,
  /<script>/i
];

/**
 * Check if text contains dangerous patterns
 */
function containsDangerousPattern(text) {
  if (!text) return false;
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Monitor copy events
 */
document.addEventListener('copy', async (event) => {
  try {
    // Get the selected text
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!selectedText) return;

    // Store original content
    originalClipboardContent = selectedText;
    copyDetected = true;

    console.log('[NoHijacking] Copy detected:', selectedText.substring(0, 50) + '...');

    // Wait a bit to see if clipboard gets modified
    setTimeout(async () => {
      try {
        // Read actual clipboard content
        const clipboardText = await navigator.clipboard.readText();

        // Compare original vs clipboard
        if (clipboardText !== originalClipboardContent) {
          console.warn('[NoHijacking] ⚠️ CLIPBOARD HIJACKING DETECTED!');
          console.warn('Original:', originalClipboardContent);
          console.warn('Modified:', clipboardText);

          // Alert user
          alertHijackingAttempt(originalClipboardContent, clipboardText);

          // Log to extension
          chrome.runtime.sendMessage({
            type: 'HIJACKING_DETECTED',
            original: originalClipboardContent,
            modified: clipboardText,
            url: window.location.href,
            timestamp: new Date().toISOString()
          });
        } else {
          // Check if content is dangerous even without modification
          if (containsDangerousPattern(clipboardText)) {
            console.warn('[NoHijacking] ⚠️ Dangerous command detected in clipboard!');
            alertDangerousCommand(clipboardText);
          }
        }
      } catch (error) {
        console.error('[NoHijacking] Error reading clipboard:', error);
      }

      copyDetected = false;
    }, 100); // Small delay to catch modifications

  } catch (error) {
    console.error('[NoHijacking] Error in copy handler:', error);
  }
});

/**
 * Monitor paste events
 */
document.addEventListener('paste', async (event) => {
  try {
    const pastedText = event.clipboardData.getData('text');

    if (!pastedText) return;

    console.log('[NoHijacking] Paste detected:', pastedText.substring(0, 50) + '...');

    // Check if pasted content is dangerous
    if (containsDangerousPattern(pastedText)) {
      console.warn('[NoHijacking] ⚠️ Dangerous command being pasted!');

      // Show warning before paste
      const shouldContinue = confirm(
        '⚠️ SECURITY WARNING - NoHijacking Extension\n\n' +
        'The command you are pasting contains potentially dangerous operations!\n\n' +
        'Command preview:\n' + pastedText.substring(0, 200) + '...\n\n' +
        'Are you sure you want to paste this?'
      );

      if (!shouldContinue) {
        event.preventDefault();
        console.log('[NoHijacking] Paste cancelled by user');

        // Log prevention
        chrome.runtime.sendMessage({
          type: 'PASTE_PREVENTED',
          content: pastedText,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      }
    }

  } catch (error) {
    console.error('[NoHijacking] Error in paste handler:', error);
  }
});

/**
 * Alert user about hijacking attempt
 */
function alertHijackingAttempt(original, modified) {
  // Create visual alert
  const alertDiv = document.createElement('div');
  alertDiv.id = 'nohijacking-alert';
  alertDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff4757, #c44569);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(255, 71, 87, 0.5);
      z-index: 999999;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: slideIn 0.3s ease;
    ">
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">
        🚨 CLIPBOARD HIJACKING DETECTED!
      </h3>
      <p style="margin: 0 0 10px 0; font-size: 14px;">
        This website modified what you copied!
      </p>
      <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
        <strong>Original:</strong><br>
        <code style="font-size: 12px; word-break: break-all;">${escapeHtml(original.substring(0, 100))}</code>
      </div>
      <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
        <strong>Modified to:</strong><br>
        <code style="font-size: 12px; word-break: break-all;">${escapeHtml(modified.substring(0, 100))}</code>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: white;
        color: #ff4757;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
      ">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(alertDiv);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 10000);
}

/**
 * Alert about dangerous command
 */
function alertDangerousCommand(command) {
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ffd700, #ff8c00);
      color: #000;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
      z-index: 999999;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">
        ⚠️ DANGEROUS COMMAND DETECTED!
      </h3>
      <p style="margin: 0 0 10px 0; font-size: 14px;">
        The copied command contains potentially dangerous operations.
      </p>
      <div style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
        <code style="font-size: 12px; word-break: break-all;">${escapeHtml(command.substring(0, 150))}</code>
      </div>
      <p style="margin: 0; font-size: 12px;">
        ⚠️ Review carefully before running!
      </p>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #000;
        color: #ffd700;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        margin-top: 10px;
      ">
        I Understand
      </button>
    </div>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 8000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

console.log('[NoHijacking] Content script loaded - Clipboard protection active! 🛡️');
