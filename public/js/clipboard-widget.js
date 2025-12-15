/**
 * Clipboard Widget - Real-time clipboard content display
 * Enhancement #2
 * Note: Widget starts hidden to avoid permission prompts
 */

let clipboardWidgetVisible = false;

/**
 * Create and initialize clipboard widget
 */
function initClipboardWidget() {
  // Create widget HTML
  const widget = document.createElement('div');
  widget.id = 'clipboardWidget';
  widget.className = 'clipboard-widget';
  widget.style.display = 'none'; // Start hidden
  widget.innerHTML = `
        <div class="clipboard-widget-header">
            <span class="clipboard-widget-title">📋 Clipboard Monitor</span>
            <button class="clipboard-widget-close" onclick="toggleClipboardWidget()">×</button>
        </div>
        <div class="clipboard-widget-content" id="clipboardWidgetContent">
            <span class="clipboard-widget-empty">No content copied yet...</span>
        </div>
    `;

  document.body.appendChild(widget);

  // Only monitor on copy events (no periodic checking to avoid permission prompts)
  document.addEventListener('copy', handleCopyEvent);

  console.log('✅ Clipboard widget initialized (hidden by default - click × to toggle)');
}

/**
 * Handle copy events
 */
function handleCopyEvent() {
  setTimeout(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        updateClipboardWidget(text);
      }
    } catch (error) {
      // Permission denied - widget will show last copied text from copy event
      const selection = window.getSelection().toString();
      if (selection) {
        updateClipboardWidget(selection);
      }
    }
  }, 100);
}

/**
 * Update clipboard widget content
 */
function updateClipboardWidget(text) {
  const content = document.getElementById('clipboardWidgetContent');
  if (!content) return;

  if (text && text.trim()) {
    // Truncate long text
    const displayText = text.length > 100 ? text.substring(0, 100) + '...' : text;
    content.innerHTML = `<code>${escapeHtml(displayText)}</code>`;

    // Highlight if it's a command (check if isCommand function exists)
    if (typeof isCommand === 'function' && isCommand(text)) {
      content.style.borderLeft = '3px solid var(--accent-red)';
    } else {
      content.style.borderLeft = '3px solid var(--accent-cyan)';
    }
  } else {
    content.innerHTML = '<span class="clipboard-widget-empty">No content copied yet...</span>';
    content.style.borderLeft = 'none';
  }
}

/**
 * Toggle clipboard widget visibility
 */
function toggleClipboardWidget() {
  const widget = document.getElementById('clipboardWidget');
  if (widget) {
    clipboardWidgetVisible = !clipboardWidgetVisible;
    widget.style.display = clipboardWidgetVisible ? 'block' : 'none';
  }
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClipboardWidget);
} else {
  initClipboardWidget();
}

// Make toggle function global
window.toggleClipboardWidget = toggleClipboardWidget;
