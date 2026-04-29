# Changelog

All notable changes to **PwdCleaner** will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)  
Author: [@SudhirDevOps1](https://github.com/SudhirDevOps1)

---

## [2.1.0] — 2026-04-29

### ✅ Fixed (Critical Bugs)
- **Unicode password crash** — `btoa()` threw `InvalidCharacterError` on passwords with non-ASCII characters (emoji, Hindi, Chinese, etc.). Replaced all `btoa`/`atob` with Unicode-safe `_safeBtoa`/`_safeAtob` helpers.
- **Toast notification invisible** — CSS class was `toast success` (space) but styles expected `toast-success` (hyphen). Fixed to `toast-${type}`.
- **Duplicate function definitions** — `renderAllEntries()` and `handleFiles()` were defined twice, old basic version overrode enhanced version. Removed duplicates.
- **Missing function crash** — `autoCleanMergeAll()`, `encryptedFileExport()`, `encryptedFileImport()` were referenced in event listeners but never defined (runtime crash). All implemented.
- **escapeRegExp double-escape** — Regex escape function had incorrect double backslash. Fixed.
- **Header sticky not working** — CSS `.header-inner` existed but HTML was missing the wrapper div. Added.

### ✅ Fixed (UX Bugs)
- **Redundant passphrase prompt** — Lock screen "Import & Decrypt" showed a dialog asking for passphrase even when the user already typed one in the input. Now uses the entered passphrase directly.
- **Lock screen show/hide password** — Added eye toggle button so users can verify their passphrase before unlocking.

### ✅ Added
- **Decrypt Dialog** — Replaced ugly browser `prompt()` with a beautiful glassmorphism modal for entering decryption passphrase.
- **Faster mobile search** — Reduced debounce from 300ms to 120ms on mobile devices for snappier search.
- **Lock screen eye toggle** — Show/hide password button on the lock screen passphrase input.
- **PRIVACY.md** — Comprehensive 15-section privacy policy document.
- **Encrypted Data Terminal** — Inspect raw encrypted `.pwdcleaner` file data to verify passwords are truly unreadable.
- **Demo Encrypt Button** — One-click demo that encrypts sample data and shows the raw encrypted output in the terminal.
- **JSON encrypted format** — Changed from binary to JSON format for `.pwdcleaner` files so they work reliably on ALL devices (Windows, Mac, Linux, Android, iOS).

### 🔄 Changed
- **Encrypted file format v2** — Now uses JSON text instead of binary. Files are human-readable (encrypted part is base64). Same AES-256-GCM + PBKDF2 200k security.
- **Footer credits** — Updated to @SudhirDevOps1 with GitHub link.

---

## [2.0.0] — 2026-04-25

### ✅ Added
- **Lock Screen** — Master passphrase required to enter the app (zero-knowledge gate).
- **Encrypted File Export/Import** — Download vault as `.pwdcleaner` encrypted file. Import & decrypt on any device.
- **One-Click Auto Clean & Merge** — Finds all exact duplicates, merges similar entries, keeps best data.
- **Auto-Clean After Export** — Toggle to clear all data automatically after every export.
- **Browser Extension** — Chrome/Chromium extension with popup UI (`extension/` directory).
- **Password Generator** — Cryptographically secure (Web Crypto API), 8-128 chars, batch generation.
- **Password Strength Analyzer** — 12 security checks, crack time estimation, improvement suggestions.
- **Health Dashboard** — Visual score ring, weak/reused/strong/2FA/short metrics.
- **Search & Filter** — Real-time search, filter by source and strength level.
- **Auto-Categorize** — Smart categorization (Social, Email, Shopping, Finance, etc.).
- **Smart Merge** — Intelligent merging of same-site/same-user entries.
- **Batch Operations** — Select all, batch delete, batch export.
- **Edit Entry Modal** — Inline editing of any entry.
- **Undo System** — 30-second undo for all destructive actions.
- **Keyboard Shortcuts** — Ctrl+I/F/D/E/G/Z/L.
- **Detailed Statistics** — Source distribution, length charts, strength overview, top domains.
- **Tab Navigation** — Workspace, Health, Generator, Analyzer, Tools, Stats.

---

## [1.0.0] — 2026-01-01

### ✅ Added
- Initial release
- 40+ password manager format support
- Duplicate detection (4 rules)
- Client-side AES-GCM encryption
- PWA with offline support
- Dark/light mode
- Glassmorphism UI
- Responsive design
- GitHub Actions CI/CD
- Privacy policy page

---

**Legend:** ✅ Added/Fixed · 🔄 Changed · ❌ Removed
