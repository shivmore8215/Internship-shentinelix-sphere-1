/**
 * Demo Terminal - Handles paste events and displays clipboard content
 */

/**
 * Initialize demo terminal
 */
function initDemoTerminal() {
  const pasteArea = document.getElementById('pasteArea');
  const terminalOutput = document.getElementById('terminalOutput');

  if (!pasteArea || !terminalOutput) {
    console.warn('Terminal elements not found');
    return;
  }

  // Handle paste event
  pasteArea.addEventListener('paste', (event) => {
    // Small delay to let paste complete
    setTimeout(() => {
      const pastedText = pasteArea.value;

      if (pastedText) {
        // Display in terminal output
        terminalOutput.textContent = pastedText;

        // Add visual feedback
        terminalOutput.style.color = 'var(--accent-red)';

        // Highlight if it contains dangerous commands
        if (containsDangerousCommand(pastedText)) {
          terminalOutput.innerHTML = highlightDangerousCommands(pastedText);
        }

        console.log('Pasted content:', pastedText);
      }
    }, 10);
  });

  // Handle input changes
  pasteArea.addEventListener('input', () => {
    const content = pasteArea.value;
    if (content) {
      terminalOutput.textContent = content;
    }
  });

  // Focus on click
  pasteArea.addEventListener('click', () => {
    pasteArea.focus();
  });

  console.log('✅ Demo terminal initialized');
}

/**
 * Check if text contains dangerous commands
 */
function containsDangerousCommand(text) {
  const dangerousKeywords = [
    'del ', 'rm ', 'format', 'rmdir', 'rd ',
    'curl', 'wget', 'invoke-webrequest',
    'powershell', 'bash', 'sh ',
    '&&', '|', ';'
  ];

  const lowerText = text.toLowerCase();
  return dangerousKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Highlight dangerous parts of command
 */
function highlightDangerousCommands(text) {
  const dangerousPatterns = [
    /(\&\&[^&]+)/g,
    /(;[^;]+)/g,
    /(\|[^|]+)/g,
    /(del\s+[^\s]+)/gi,
    /(rm\s+[^\s]+)/gi,
    /(format\s+[^\s]+)/gi,
    /(curl\s+http[^\s]+)/gi,
    /(wget\s+http[^\s]+)/gi,
    /(Invoke-WebRequest[^;]+)/gi
  ];

  let highlighted = text;

  dangerousPatterns.forEach(pattern => {
    highlighted = highlighted.replace(pattern, '<span class="highlight-danger">$1</span>');
  });

  return highlighted;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemoTerminal);
} else {
  initDemoTerminal();
}
