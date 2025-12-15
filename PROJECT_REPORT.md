# Project Report: Clipboard Hijacking Simulation & Protection System

**Project Name:** Clipboard Hijacking Simulation (Shentinelix Sphere Internship Project)
**Date:** 2025-12-15
**Version:** 1.0.0

---

## 1. Executive Summary

The **Clipboard Hijacking Simulation** is an educational cybersecurity project designed to raise awareness about the risks of "clipboard hijacking"—a technique where malicious websites secretly modify the content of a user's clipboard. The project consists of two main components:

1.  **Web Application:** A safe, controlled environment that demonstrates how clipboard hijacking works by simulating attacks on common command-line instructions.
2.  **"NoHijacking" Browser Extension:** A proactive defense tool that detects and prevents real-time clipboard modifications, alerting users to potential threats.

This project aims to bridge the gap between theoretical security knowledge and practical awareness, empowering users to adopt safer computing habits such as verifying commands before execution.

---

## 2. Project Objectives

- **Educational Awareness:** To demonstrate the mechanics of clipboard hijacking in a visual and interactive manner.
- **Safe Simulation:** To provide a risk-free environment where users can experience the attack without actual harm (no malicious code is executed).
- **Proactive Defense:** To develop a browser extension that actively protects users from this specific attack vector.
- **Ethical Responsibility:** To emphasize the importance of using security knowledge for defense and protection rather than exploitation.

---

## 3. Technical Architecture

The project utilizes a modern web development stack to deliver both the simulation and the protection tool.

### 3.1 Web Application (Simulation)

- **Backend:** Node.js with Express.js (Port 8055). Handles static file serving and event logging APIs.
- **Frontend:** HTML5, CSS3 (Cyber Security Theme), Vanilla JavaScript.
- **Core Logic:**
  - **Clipboard API Integration:** Uses `navigator.clipboard` to detect copy events and modify content.
  - **Pattern Recognition:** Identifies commands from Windows CMD, PowerShell, and Linux Bash.
  - **Event Logging:** Records simulation events for educational review (stored in `logs/events.json`).

### 3.2 Browser Extension ("NoHijacking")

- **Type:** Chrome/Edge Browser Extension (Manifest V3).
- **Components:**
  - **Content Scripts:** Monitor DOM copy events and compare selection vs. clipboard content.
  - **Background Service Worker:** Handles notifications and badge updates.
  - **Popup UI:** Displays attack statistics and recent activity logs.
- **Detection Mechanism:** Checks for discrepancies between user selection and actual clipboard data, and scans for dangerous patterns (e.g., `rm -rf`, `curl | bash`).

---

## 4. Key Features

### 4.1 Simulation Dashboard

- **Split-View Interface:** Simultaneously shows the "Original Command" (what the user thinks they copied) and the "Hijacked Command" (what is actually in the clipboard).
- **Real-Time Feedback:** Instant visual alerts when a command is modified.
- **Terminal Emulator:** A safe area to "paste" and verify the hijacked command, highlighting the malicious payload in red.
- **Educational Modules:** Integrated "Prevention Tips" and "Safety & Ethics" pages.

### 4.2 NoHijacking Extension

- **Live Protection:** Runs in the background and alerts users immediately upon detecting a clipboard modification.
- **Visual Alerts:** Displays on-page warnings and browser notifications.
- **Activity Logging:** Keeps a local history of detected attempts and prevented pastes.
- **Privacy-Focused:** All processing is done locally; no data is sent to external servers.

---

## 5. Safety & Ethical Guidelines

This project adheres to strict ethical standards to ensure it remains an educational tool:

- **No Malicious Execution:** The simulation _never_ executes the hijacked commands; it only displays them as text.
- **Local-Only Design:** The web app is intended for `localhost` use to prevent accidental public exposure.
- **Clear Warnings:** Prominent banners and disclaimers inform users that they are in a simulation environment.
- **Educational Focus:** The primary goal is defense. The "NoHijacking" extension provides a constructive solution to the demonstrated problem.

---

## 6. Future Enhancements

- **Advanced Pattern Matching:** Integrating machine learning to detect obfuscated or novel command patterns.
- **Cross-Platform Extension:** Porting the "NoHijacking" extension to Firefox and Safari.
- **Enterprise Features:** Centralized logging and reporting for organizational security training.
- **Mobile Demonstration:** Creating a mobile-responsive version to demonstrate clipboard risks on smartphones.

---

## 7. Conclusion

The Clipboard Hijacking Simulation project successfully demonstrates a subtle but dangerous attack vector. By combining a visceral, hands-on simulation with a practical defense tool, it effectively achieves its goal of improving cybersecurity awareness and promoting safer digital habits.
