/**
 * Admin Panel - Fetch and display logged events
 */

let allEvents = [];

/**
 * Fetch events from API
 */
async function fetchEvents() {
  try {
    const response = await fetch('/api/events');
    const data = await response.json();

    if (data.success) {
      allEvents = data.events || [];
      displayEvents(allEvents);
      updateStatistics(allEvents);
    } else {
      console.error('Failed to fetch events');
      showError('Failed to load events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    showError('Error loading events');
  }
}

/**
 * Display events in table
 */
function displayEvents(events) {
  const loadingMessage = document.getElementById('loadingMessage');
  const noEventsMessage = document.getElementById('noEventsMessage');
  const eventsTableContainer = document.getElementById('eventsTableContainer');
  const eventsTableBody = document.getElementById('eventsTableBody');
  const eventCount = document.getElementById('eventCount');

  // Hide loading
  if (loadingMessage) loadingMessage.style.display = 'none';

  // Update count
  if (eventCount) eventCount.textContent = events.length;

  if (events.length === 0) {
    // Show no events message
    if (noEventsMessage) noEventsMessage.classList.remove('hidden');
    if (eventsTableContainer) eventsTableContainer.classList.add('hidden');
    return;
  }

  // Show table
  if (noEventsMessage) noEventsMessage.classList.add('hidden');
  if (eventsTableContainer) eventsTableContainer.classList.remove('hidden');

  // Clear existing rows
  if (eventsTableBody) {
    eventsTableBody.innerHTML = '';

    // Add rows (most recent first)
    const sortedEvents = [...events].reverse();

    sortedEvents.forEach(event => {
      const row = document.createElement('tr');

      // Format timestamp
      const timestamp = new Date(event.timestamp).toLocaleString();

      // Truncate long commands for display
      const originalCmd = truncateText(event.original_command, 50);
      const modifiedCmd = truncateText(event.modified_command, 50);

      row.innerHTML = `
                <td>${timestamp}</td>
                <td><code>${escapeHtml(originalCmd)}</code></td>
                <td><code style="color: var(--accent-red);">${escapeHtml(modifiedCmd)}</code></td>
                <td><span class="highlight-danger">${event.event_type || 'clipboard_hijack'}</span></td>
            `;

      eventsTableBody.appendChild(row);
    });
  }
}

/**
 * Update statistics
 */
function updateStatistics(events) {
  const statTotal = document.getElementById('statTotal');
  const statRecent = document.getElementById('statRecent');
  const statCommon = document.getElementById('statCommon');

  if (statTotal) statTotal.textContent = events.length;

  if (events.length > 0) {
    // Most recent
    const mostRecent = events[events.length - 1];
    if (statRecent) {
      const timeAgo = getTimeAgo(new Date(mostRecent.timestamp));
      statRecent.textContent = timeAgo;
    }

    // Most common command
    const commandCounts = {};
    events.forEach(event => {
      const cmd = event.original_command;
      commandCounts[cmd] = (commandCounts[cmd] || 0) + 1;
    });

    const mostCommon = Object.entries(commandCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (statCommon && mostCommon) {
      statCommon.textContent = `${truncateText(mostCommon[0], 30)} (${mostCommon[1]}x)`;
    }
  } else {
    if (statRecent) statRecent.textContent = 'N/A';
    if (statCommon) statCommon.textContent = 'N/A';
  }
}

/**
 * Clear all events
 */
async function clearEvents() {
  if (!confirm('Are you sure you want to clear all logged events? This cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch('/api/events', {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      allEvents = [];
      displayEvents(allEvents);
      updateStatistics(allEvents);
      showSuccess('All events cleared successfully');
    } else {
      showError('Failed to clear events');
    }
  } catch (error) {
    console.error('Error clearing events:', error);
    showError('Error clearing events');
  }
}

/**
 * Export events to CSV
 */
function exportToCSV() {
  if (allEvents.length === 0) {
    showError('No events to export');
    return;
  }

  // Create CSV content
  const headers = ['Timestamp', 'Original Command', 'Modified Command', 'Event Type'];
  const rows = allEvents.map(event => [
    new Date(event.timestamp).toLocaleString(),
    `"${event.original_command.replace(/"/g, '""')}"`,
    `"${event.modified_command.replace(/"/g, '""')}"`,
    event.event_type || 'clipboard_hijack'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download file
  downloadFile(csvContent, 'clipboard-events.csv', 'text/csv');
  showSuccess('Events exported to CSV successfully');
}

/**
 * Export events to JSON
 */
function exportToJSON() {
  if (allEvents.length === 0) {
    showError('No events to export');
    return;
  }

  const jsonContent = JSON.stringify(allEvents, null, 2);
  downloadFile(jsonContent, 'clipboard-events.json', 'application/json');
  showSuccess('Events exported to JSON successfully');
}

/**
 * Download file helper
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Utility functions
 */
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function showError(message) {
  alert('❌ ' + message);
}

function showSuccess(message) {
  alert('✅ ' + message);
}

/**
 * Initialize admin panel
 */
function initAdminPanel() {
  // Fetch events on load
  fetchEvents();

  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchEvents);
  }

  // Clear button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearEvents);
  }

  // Export buttons
  const exportCSVBtn = document.getElementById('exportCSVBtn');
  if (exportCSVBtn) {
    exportCSVBtn.addEventListener('click', exportToCSV);
  }

  const exportJSONBtn = document.getElementById('exportJSONBtn');
  if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', exportToJSON);
  }

  console.log('✅ Admin panel initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
  initAdminPanel();
}
