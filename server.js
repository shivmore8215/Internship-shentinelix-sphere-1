const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./utils/logger');

const app = express();
const PORT = 8055;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS headers for localhost development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes

/**
 * POST /api/log-event
 * Log a clipboard hijacking event
 */
app.post('/api/log-event', (req, res) => {
  try {
    const { original_command, modified_command, event_type } = req.body;

    if (!original_command || !modified_command) {
      return res.status(400).json({
        error: 'Missing required fields: original_command and modified_command'
      });
    }

    const logEntry = logger.logEvent({
      original_command,
      modified_command,
      event_type: event_type || 'clipboard_hijack'
    });

    res.json({
      success: true,
      message: 'Event logged successfully',
      entry: logEntry
    });
  } catch (error) {
    console.error('Error in /api/log-event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/events
 * Get all logged clipboard events
 */
app.get('/api/events', (req, res) => {
  try {
    const events = logger.getEvents();
    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Error in /api/events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/events
 * Clear all logged events
 */
app.delete('/api/events', (req, res) => {
  try {
    const success = logger.clearEvents();
    if (success) {
      res.json({
        success: true,
        message: 'All events cleared successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to clear events' });
    }
  } catch (error) {
    console.error('Error in DELETE /api/events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/prevention', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prevention.html'));
});

app.get('/safety', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'safety.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Clipboard Hijacking Attack Simulation                    ║');
  console.log('║  Educational Cybersecurity Awareness Tool                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('⚠️  WARNING: This is an educational demonstration only!');
  console.log('   Never use clipboard hijacking techniques maliciously.');
  console.log('');
  console.log('📚 Available pages:');
  console.log(`   • Main Demo:      http://localhost:${PORT}/`);
  console.log(`   • Prevention:     http://localhost:${PORT}/prevention`);
  console.log(`   • Safety Guide:   http://localhost:${PORT}/safety`);
  console.log(`   • Admin Logs:     http://localhost:${PORT}/admin`);
  console.log('');
});
