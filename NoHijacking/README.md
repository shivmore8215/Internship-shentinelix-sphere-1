# 🛡️ NoHijacking - Clipboard Protection Extension

A browser extension that detects and prevents clipboard hijacking attacks, protecting users from malicious command modifications.

## Features

### 🔍 **Real-time Detection**
- Monitors all clipboard copy operations
- Compares original content with actual clipboard content
- Detects modifications made by malicious scripts

### ⚠️ **Dangerous Pattern Recognition**
- Identifies potentially harmful commands:
  - `rm -rf` (Linux file deletion)
  - `del /s /q` (Windows file deletion)
  - `format` commands
  - `curl | bash` (remote code execution)
  - `wget | sh` (remote code execution)
  - PowerShell encoded commands
  - JavaScript `eval()` and `exec()`
  - Script injection attempts

### 🚨 **Visual Alerts**
- Immediate on-page notifications when hijacking is detected
- Shows both original and modified content
- Warning alerts for dangerous commands
- Confirmation dialogs before pasting risky content

### 📊 **Activity Logging**
- Tracks all hijacking attempts
- Records prevented dangerous pastes
- Displays statistics in popup
- Shows recent activity with timestamps and URLs

### 🔔 **Browser Notifications**
- Desktop notifications for hijacking attempts
- Badge counter showing threat count
- Alerts for prevented dangerous pastes

## Installation

### Chrome/Edge (Developer Mode)

1. **Download the Extension**
   - Copy the entire `NoHijacking` folder

2. **Open Extensions Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `NoHijacking` folder
   - Extension will be installed and activated

5. **Verify Installation**
   - Look for the 🛡️ icon in your browser toolbar
   - You should see a notification: "NoHijacking Activated!"

## Usage

### Automatic Protection
Once installed, NoHijacking works automatically:
- ✅ Monitors all copy operations
- ✅ Detects clipboard modifications
- ✅ Alerts you to threats
- ✅ Prevents dangerous pastes

### View Activity
Click the extension icon to see:
- Number of hijacking attempts detected
- Number of dangerous pastes prevented
- Recent activity log with details

### Clear Log
- Click "Clear Log" in the popup to reset statistics

## How It Works

### 1. Copy Monitoring
```javascript
// When you copy text
document.addEventListener('copy', async (event) => {
  // Store original content
  originalContent = selection.toString();
  
  // Wait briefly
  setTimeout(async () => {
    // Check actual clipboard
    clipboardContent = await navigator.clipboard.readText();
    
    // Compare
    if (clipboardContent !== originalContent) {
      // HIJACKING DETECTED!
      alertUser();
    }
  }, 100);
});
```

### 2. Paste Protection
```javascript
// Before pasting
document.addEventListener('paste', (event) => {
  const content = event.clipboardData.getData('text');
  
  if (containsDangerousPattern(content)) {
    // Show warning
    if (!confirm('Dangerous command detected! Continue?')) {
      event.preventDefault(); // Block paste
    }
  }
});
```

### 3. Pattern Detection
The extension checks for dangerous patterns like:
- File deletion commands
- Remote code execution
- System formatting
- Script injection
- Encoded payloads

## Testing

### Test with the Simulation
1. Navigate to your Clipboard Hijacking Simulation at `http://localhost:8055`
2. Try copying a command
3. NoHijacking will detect the modification and alert you!

### Expected Behavior
- 🚨 Red alert appears on page
- 🔔 Browser notification shows
- 📊 Extension badge updates
- 📝 Activity logged in popup

## File Structure

```
NoHijacking/
├── manifest.json       # Extension configuration
├── content.js          # Monitors clipboard on web pages
├── background.js       # Handles notifications and logging
├── popup.html          # Extension popup UI
├── popup.js            # Popup functionality
├── icons/              # Extension icons (16x16, 48x48, 128x128)
└── README.md           # This file
```

## Permissions Explained

- **clipboardRead**: Read clipboard to detect modifications
- **clipboardWrite**: (Future) Restore original content
- **notifications**: Show desktop alerts
- **storage**: Save activity log
- **activeTab**: Access current page for alerts
- **<all_urls>**: Monitor clipboard on all websites

## Privacy

- ✅ All processing happens locally
- ✅ No data sent to external servers
- ✅ Clipboard content never leaves your browser
- ✅ Activity log stored locally only

## Limitations

- Requires clipboard API support (modern browsers)
- Cannot prevent all types of hijacking
- Some websites may block clipboard access
- 100ms delay for detection (necessary for accuracy)

## Future Enhancements

- [ ] Automatic clipboard restoration
- [ ] Whitelist trusted websites
- [ ] Custom dangerous pattern rules
- [ ] Export activity log
- [ ] Multi-language support
- [ ] Firefox support

## Contributing

This extension is part of an educational cybersecurity project. Feel free to:
- Report bugs
- Suggest features
- Improve detection patterns
- Add translations

## License

Educational use only. Part of the Clipboard Hijacking Attack Simulation project.

## Disclaimer

⚠️ This extension is designed for educational purposes and cybersecurity awareness. While it provides protection against clipboard hijacking, no security tool is 100% effective. Always verify commands before executing them.

---

**Made with ❤️ for cybersecurity awareness**

🛡️ Stay safe, verify before you paste!
