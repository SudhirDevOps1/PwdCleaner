# PwdCleaner — Privacy Policy

**Effective Date:** January 2025  
**Last Updated:** January 2025  
**Version:** 2.0

---

## The Short Version

> **We don't collect anything. We don't send anything. We don't know anything about you. Everything happens on your device. Period.**

---

## Table of Contents

1. [What PwdCleaner Is](#what-pwdcleaner-is)
2. [Zero Data Collection](#zero-data-collection)
3. [Zero-Knowledge Architecture](#zero-knowledge-architecture)
4. [What Runs In Your Browser](#what-runs-in-your-browser)
5. [Encryption Details](#encryption-details)
6. [Local Storage Usage](#local-storage-usage)
7. [Service Worker & Offline Mode](#service-worker--offline-mode)
8. [Browser Extension Privacy](#browser-extension-privacy)
9. [What We Never Do](#what-we-never-do)
10. [Your Data, Your Control](#your-data-your-control)
11. [Third-Party Dependencies](#third-party-dependencies)
12. [Open Source & Auditable](#open-source--auditable)
13. [Children's Privacy](#childrens-privacy)
14. [Changes to This Policy](#changes-to-this-policy)
15. [Contact](#contact)

---

## What PwdCleaner Is

PwdCleaner is a free, open-source, client-side web application that helps you:

- Remove duplicate passwords across 40+ password manager and browser formats
- Export your cleaned vault to any supported format
- Generate strong passwords
- Analyze password health
- Encrypt and decrypt password vault files

**PwdCleaner is NOT a cloud service.** It runs entirely inside your web browser. There is no backend server, no database, no API, and no account system.

---

## Zero Data Collection

PwdCleaner collects **zero** personal data. Specifically:

| Data Type | Collected? |
|---|---|
| Passwords | ❌ Never |
| Usernames | ❌ Never |
| Email addresses | ❌ Never |
| URLs / Websites | ❌ Never |
| IP addresses | ❌ Never |
| Browser fingerprint | ❌ Never |
| Device information | ❌ Never |
| Usage analytics | ❌ Never |
| Cookies | ❌ Never |
| Location data | ❌ Never |

**There is no server to send data to.** The entire application is a set of static HTML, CSS, and JavaScript files that run in your browser.

---

## Zero-Knowledge Architecture

PwdCleaner follows a **zero-knowledge** design:

- **Your passwords never leave your device.** All parsing, duplicate detection, encryption, and export happen inside your browser's JavaScript engine.
- **No network requests are made.** After the initial page load (which can be cached for offline use), the application makes zero network requests.
- **No telemetry, no phone-home, no beacons.** We don't know if you're using the app, what you're doing with it, or when you close it.
- **Encrypted files use a passphrase only you know.** When you export an encrypted `.pwdcleaner` file, the encryption key is derived from your passphrase using PBKDF2 with 200,000 iterations. We never see your passphrase, and we cannot decrypt your files.

---

## What Runs In Your Browser

When you use PwdCleaner, the following files are loaded:

| File | Purpose |
|---|---|
| `index.html` | Main application page |
| `styles.css` | Styling (glassmorphism, dark/light mode) |
| `script.js` | All application logic |
| `manifest.json` | PWA configuration |
| `sw.js` | Service Worker for offline caching |
| `privacy.html` | In-app privacy policy page |

**All files are self-hosted.** No external CDNs, no Google Fonts, no analytics scripts, no third-party JavaScript of any kind.

---

## Encryption Details

When you use the encrypted file export feature:

### Key Derivation
- **Algorithm:** PBKDF2 (Password-Based Key Derivation Function 2)
- **Hash:** SHA-256
- **Iterations:** 200,000
- **Salt:** 32 bytes, randomly generated using `crypto.getRandomValues()`

### Encryption
- **Algorithm:** AES-256-GCM (Galois/Counter Mode)
- **Key Size:** 256 bits
- **IV (Nonce):** 12 bytes, randomly generated using `crypto.getRandomValues()`
- **Authentication:** GCM provides built-in authenticated encryption (AEAD)

### File Format
```
[11 bytes: "PWDCLEANER" magic header]
[2 bytes:  version (2.0)]
[32 bytes: PBKDF2 salt]
[12 bytes: AES-GCM IV]
[N bytes:  encrypted payload (JSON)]
```

### Security Properties
- **Confidentiality:** AES-256-GCM encryption ensures only someone with the correct passphrase can read the data.
- **Integrity:** GCM authentication tag prevents tampering — if anyone modifies the encrypted file, decryption will fail.
- **Forward Secrecy:** Each export generates a unique salt and IV, so identical plaintexts produce different ciphertexts.
- **Brute-Force Resistance:** 200,000 PBKDF2 iterations make password guessing computationally expensive.

### What We Cannot Do
- We cannot recover your encrypted files if you forget your passphrase.
- We cannot decrypt files created by other users.
- We do not store your passphrase anywhere — it exists only in your browser's memory during the encryption/decryption operation and is discarded immediately after.

---

## Local Storage Usage

PwdCleaner may use your browser's `localStorage` for:

| Key | Purpose | Data |
|---|---|---|
| `pwd-entries` | Store imported password entries for session persistence | Your password data (plaintext) |
| `pwd-encrypted` | Store encrypted version if you enable local encryption | AES-GCM encrypted blob |
| `pwd-theme` | Remember your dark/light mode preference | `"dark"` or `"light"` |

### Important Notes
- `localStorage` data **stays on your device** and is never transmitted anywhere.
- You can clear all stored data at any time using the "Clear All Data" button in the app.
- If you use the "Auto-Clean After Export" feature, `pwd-entries` is automatically cleared after every export.
- `localStorage` is per-browser, per-device — it does not sync across devices.

---

## Service Worker & Offline Mode

PwdCleaner registers a Service Worker (`sw.js`) to enable offline use:

- The Service Worker **caches the application files** (HTML, CSS, JS) so the app works without an internet connection.
- The Service Worker **does not** collect, transmit, or modify any of your data.
- The Service Worker uses a **cache-first strategy** — cached files are served immediately, and updates are checked in the background.
- You can unregister the Service Worker at any time through your browser's developer tools.

---

## Browser Extension Privacy

The PwdCleaner browser extension (Chrome/Chromium-based browsers) follows the same privacy principles:

- **No external requests.** The extension does not communicate with any server.
- **No content script injection.** The extension does not read or modify web page content.
- **Minimal permissions.** The extension only requests `storage` permission for saving your theme preference.
- **Popup only.** The extension opens the PwdCleaner app in a popup window — all processing happens client-side.
- **No telemetry.** The extension does not track your browsing, clicks, or usage.

---

## What We Never Do

- ❌ We never collect your passwords, usernames, or any personal data.
- ❌ We never send data to any server, API, or third-party service.
- ❌ We never use cookies, tracking pixels, or fingerprinting.
- ❌ We never use analytics (no Google Analytics, no Mixpanel, no Plausible, nothing).
- ❌ We never use advertising networks or ad trackers.
- ❌ We never use social media widgets that track you.
- ❌ We never load external fonts, scripts, or stylesheets from CDNs.
- ❌ We never sell, share, or monetize your data in any way.
- ❌ We never create user accounts or profiles.
- ❌ We never require registration or sign-up.

---

## Your Data, Your Control

You have **full control** over your data at all times:

| Action | How |
|---|---|
| **View your data** | All entries are visible in the app's interface |
| **Export your data** | Use "Export Cleaned Data" to download in any format |
| **Delete your data** | Use "Clear All Data" to wipe everything from localStorage |
| **Encrypt your data** | Use "Encrypt & Save" or "Encrypt & Download File" |
| **Auto-clean** | Enable "Auto-Clean After Export" to auto-wipe on export |
| **Undo** | Any destructive action can be undone within 30 seconds |
| **Offline delete** | Clear your browser's site data to remove all stored information |

---

## Third-Party Dependencies

PwdCleaner has **zero third-party dependencies**:

- No JavaScript frameworks (no React, Vue, Angular, jQuery)
- No CSS frameworks (no Bootstrap, Tailwind CDN)
- No external CDNs (no jsDelivr, cdnjs, unpkg)
- No external fonts (uses system fonts only)
- No external icons (uses inline SVG only)

Everything is written in vanilla HTML, CSS, and JavaScript.

---

## Open Source & Auditable

PwdCleaner is fully open source. You can:

- **Read every line of code** to verify these privacy claims.
- **Run it locally** by downloading the files and opening `index.html` in any browser.
- **Fork and modify** it under the MIT License.
- **Report security issues** privately via email.
- **Contribute** improvements via Pull Requests.

**Repository:** [https://github.com/sudhirdevops1/PwdCleaner](https://github.com/sudhirdevops1/PwdCleaner)

---

## Children's Privacy

PwdCleaner does not knowingly collect any data from anyone, including children under 13. Since we collect no data at all, COPPA compliance is inherent in our design.

---

## Changes to This Policy

If this privacy policy is ever updated, the changes will be reflected in:

- The `PRIVACY.md` file in the repository
- The `privacy.html` page within the app
- The "Last Updated" date at the top of this document

Since we do not collect contact information, we cannot notify users of changes directly. We recommend checking the repository for updates periodically.

---

## Contact

If you have privacy concerns, security vulnerability reports, or questions:

- **Email:** developer@example.com
- **GitHub Issues:** [https://github.com/sudhirdevops1/PwdCleaner/issues](https://github.com/sudhirdevops1/PwdCleaner/issues)
- **LinkedIn:** [https://linkedin.com/in/developer](https://linkedin.com/in/developer)

---

## Summary

| Principle | Status |
|---|---|
| Zero data collection | ✅ |
| Zero tracking | ✅ |
| Zero cookies | ✅ |
| Zero external requests | ✅ |
| Zero third-party scripts | ✅ |
| Client-side only | ✅ |
| Offline-first (PWA) | ✅ |
| AES-256-GCM encryption | ✅ |
| PBKDF2 key derivation (200k iterations) | ✅ |
| Zero-knowledge architecture | ✅ |
| Open source (MIT License) | ✅ |
| Fully auditable | ✅ |

**Your passwords are your business. We just help you clean them up.**

---

*This privacy policy applies to the PwdCleaner web application and browser extension only. It does not apply to any third-party password managers whose data formats PwdCleaner can parse.*
