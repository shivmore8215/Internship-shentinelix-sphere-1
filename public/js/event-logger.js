/**
 * Event Logger - Sends clipboard hijacking events to backend API
 */

/**
 * Log clipboard hijacking event to backend
 */
async function logClipboardEvent(originalCommand, modifiedCommand) {
  try {
    const response = await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        original_command: originalCommand,
        modified_command: modifiedCommand,
        event_type: 'clipboard_hijack'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Event logged successfully:', data);
    } else {
      console.error('Failed to log event:', response.statusText);
    }
  } catch (error) {
    console.error('Error logging event:', error);
  }
}

// Make function available globally
window.logClipboardEvent = logClipboardEvent;
