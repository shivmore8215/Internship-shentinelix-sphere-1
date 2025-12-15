const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logsFile = path.join(logsDir, 'events.json');

/**
 * Initialize logs file if it doesn't exist
 */
function initializeLogsFile() {
    if (!fs.existsSync(logsFile)) {
        fs.writeFileSync(logsFile, JSON.stringify([], null, 2));
    }
}

/**
 * Sanitize command text to prevent injection
 */
function sanitizeCommand(command) {
    if (typeof command !== 'string') return '';
    // Remove any potentially harmful characters but keep command structure
    return command.substring(0, 500); // Limit length
}

/**
 * Log a clipboard hijacking event
 * @param {Object} eventData - Event data containing original_command, modified_command
 */
function logEvent(eventData) {
    try {
        initializeLogsFile();
        
        // Read existing logs
        const logsContent = fs.readFileSync(logsFile, 'utf8');
        const logs = JSON.parse(logsContent);
        
        // Create new log entry
        const logEntry = {
            timestamp: new Date().toISOString(),
            original_command: sanitizeCommand(eventData.original_command),
            modified_command: sanitizeCommand(eventData.modified_command),
            event_type: eventData.event_type || 'clipboard_hijack'
        };
        
        // Add to logs
        logs.push(logEntry);
        
        // Keep only last 100 entries to prevent file from growing too large
        if (logs.length > 100) {
            logs.shift();
        }
        
        // Write back to file
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
        
        return logEntry;
    } catch (error) {
        console.error('Error logging event:', error);
        return null;
    }
}

/**
 * Get all logged events
 */
function getEvents() {
    try {
        initializeLogsFile();
        const logsContent = fs.readFileSync(logsFile, 'utf8');
        return JSON.parse(logsContent);
    } catch (error) {
        console.error('Error reading events:', error);
        return [];
    }
}

/**
 * Clear all logged events
 */
function clearEvents() {
    try {
        fs.writeFileSync(logsFile, JSON.stringify([], null, 2));
        return true;
    } catch (error) {
        console.error('Error clearing events:', error);
        return false;
    }
}

module.exports = {
    logEvent,
    getEvents,
    clearEvents
};
