# ⚠️ PwdCleaner — Limitations & Known Issues

> **Honest transparency about what PwdCleaner can and cannot do.**

Created by [@SudhirDevOps1](https://github.com/SudhirDevOps1)

---

## 📋 Quick Summary

PwdCleaner is a **local-only, client-side** tool. It is NOT a replacement for a password manager. It is a **duplicate cleaner and format converter** that runs entirely in your browser.

---

## 🔒 Security Limitations

### 1. Browser Storage is NOT Secure Storage
- Passwords stored in `localStorage` are **plaintext by default** (encrypted only if you use the local encryption toggle)
- `localStorage` is accessible to any JavaScript on the same origin
- If your browser has a malicious extension, it could read `localStorage`
- **Mitigation:** Use the "Auto-Clean After Export" feature, or manually click "Clear All Data" after exporting

### 2. Master Passphrase is Session-Based
- The passphrase you enter on the lock screen is held in JavaScript memory (`state.masterPassphrase`)
- If someone has physical access to your unlocked computer and opens DevTools, they can read it
- The passphrase is **NOT** stored in localStorage or any persistent storage
- **Mitigation:** Lock your computer when walking away, use a strong OS-level password

### 3. No Memory Protection
- JavaScript cannot securely wipe memory (no `SecureZeroMemory` equivalent in the browser)
- Passwords may remain in browser memory until the tab is closed or garbage collected
- **Mitigation:** Close the browser tab after you're done, use "Clear All Data" before closing

### 4. Encrypted File Security
- `.pwdcleaner` files use AES-256-GCM with PBKDF2 (200k iterations) — this is strong encryption
- BUT: if your passphrase is weak (e.g., "password123"), the file can be brute-forced
- There is no key stretching beyond PBKDF2 (no Argon2 — not available in browsers)
- **Mitigation:** Use a strong, unique passphrase (16+ characters, mixed types)

### 5. No 2FA / Multi-Factor
- PwdCleaner has no two-factor authentication
- Access is protected only by the master passphrase
- This is a single-user, single-device tool — not a team solution

---

## 🌐 Browser & Platform Limitations

### 6. localStorage Size Limit
- Most browsers allow ~5-10 MB per origin for `localStorage`
- Very large vaults (50,000+ entries) may hit this limit
- **Mitigation:** Use encrypted file export/import instead of relying on localStorage

### 7. No Cross-Device Sync
- Data stored in `localStorage` is **per-device, per-browser**
- If you use Chrome on your laptop, the data is NOT available on your phone's Chrome
- **Mitigation:** Export encrypted `.pwdcleaner` file → transfer to other device → import

### 8. Service Worker Cache Invalidation
- When PwdCleaner is updated (new version pushed), the Service Worker may serve cached old files
- Users may need to hard-refresh (Ctrl+Shift+R) to get the latest version
- **Mitigation:** Version the cache in `sw.js` (already done: `pwd-cleaner-v1.0.0`)

### 9. No IndexedDB
- PwdCleaner uses `localStorage` instead of IndexedDB
- IndexedDB would allow larger storage (hundreds of MB) and better performance
- **Trade-off:** `localStorage` is simpler and synchronous; IndexedDB is async and more complex

### 10. Mobile Keyboard Issues
- On some iOS devices, password fields may trigger auto-fill suggestions
- `autocomplete="off"` is set but browsers may ignore it
- **Mitigation:** Users can disable auto-fill in browser settings

---

## 📁 Format & Parsing Limitations

### 11. Not All Formats are 100% Accurate
- PwdCleaner uses heuristic-based CSV/JSON parsing
- Some password managers use proprietary or undocumented formats
- Column auto-detection may misidentify fields in unusual CSV files
- **Mitigation:** After import, manually verify a few entries before deleting originals

### 12. 1Password 1PUX Support is Limited
- 1PUX files are ZIP archives containing JSON
- PwdCleaner can parse the JSON but cannot extract ZIP files in the browser
- Users must unzip first, then import the inner JSON
- **Mitigation:** Use 1Password's CSV export instead

### 13. KeePass XML Parsing is Basic
- Nested groups in KeePass XML may not be fully preserved
- Custom string fields beyond Title/Username/Password/URL/Notes are ignored
- Attachments are not supported

### 14. No Support for Proprietary Binary Formats
- Some password managers export in proprietary binary formats (not CSV/JSON/XML)
- PwdCleaner only supports **text-based** formats (CSV, JSON, TXT, XML)
- Cannot parse: `.kdbx` (KeePass binary), `.1pif` (1Password legacy), `.enpass` (Enpass binary)

### 15. Export Format Accuracy
- Exported CSV/JSON files may not be **byte-for-byte identical** to the original manager's format
- Some managers use specific column ordering, quoting styles, or encoding
- The exported file should be **importable** by the target manager, but may need minor adjustments

### 16. TOTP/2FA Fields
- TOTP secret keys are preserved during import/export
- BUT: PwdCleaner does not generate TOTP codes
- Some managers store TOTP differently (URI vs raw secret) — conversion may lose metadata

### 17. Folder/Group Hierarchies
- Flat CSV formats lose folder hierarchy (all entries go to root)
- JSON formats that support nested groups are preserved
- Export to CSV will flatten any group hierarchy

---

## 🧠 Feature Limitations

### 18. No Real-Time Collaboration
- PwdCleaner is a single-user, single-device tool
- No multi-user support, no sharing, no team features
- No WebSocket or real-time sync

### 19. No Cloud Backup
- No integration with Google Drive, Dropbox, iCloud, etc.
- All data stays on your device
- Users must manually manage file transfers

### 20. Password Generator Limitations
- Uses `crypto.getRandomValues()` — cryptographically secure
- BUT: browser-based CSPRNG may not be as strong as hardware RNG
- Generated passwords are displayed in the browser — visible to shoulder surfers
- Generated passwords are NOT automatically saved

### 21. Health Score is Simplified
- Password health scoring uses a simplified heuristic model
- Does NOT check against Have I Been Pwned or any breach database (no network requests)
- Does NOT analyze actual password entropy mathematically
- Score should be treated as a rough guide, not a definitive security rating

### 22. No Password History
- PwdCleaner does not track password change history
- If you edit a password, the old value is lost
- No versioning of entries

### 23. Search is Client-Side Only
- Search uses simple `String.includes()` matching
- No fuzzy matching, no Levenshtein distance, no regex support
- Very large datasets (100,000+ entries) may cause noticeable lag on mobile

### 24. No Undo Beyond 30 Seconds
- The undo buffer is cleared after 30 seconds
- After 30 seconds, deleted entries cannot be recovered
- Refreshing the page clears the undo buffer

---

## 📱 Mobile Limitations

### 25. PWA Install is Browser-Dependent
- Not all browsers support PWA installation (e.g., Firefox on Android has limited support)
- iOS Safari requires "Add to Home Screen" manually — no automatic install prompt
- Some features (clipboard API, file download) may behave differently on mobile

### 26. File Upload on Mobile
- Some mobile browsers limit multi-file selection
- Very large files (>50 MB) may crash the tab on low-memory devices
- Drag & drop does not work on most mobile browsers — use "Click to browse" instead

### 27. Toast Notifications on Small Screens
- Toast notifications may overlap with mobile browser chrome (address bar, bottom bar)
- Already handled with responsive positioning, but edge cases exist

---

## 🔄 Update & Deployment Limitations

### 28. GitHub Pages Cache
- GitHub Pages has aggressive CDN caching
- After pushing updates, users may see old content for several minutes
- Service Worker caching makes this worse — users may need hard-refresh

### 29. No Auto-Update
- PwdCleaner cannot auto-update itself
- Users must manually refresh or re-visit the page to get updates
- The Service Worker caches files — stale cache is a known issue

### 30. No Versioned File Format
- The `.pwdcleaner` encrypted file format is v2 (JSON envelope)
- Future versions may change the format
- Old files should remain decryptable (forward-compatible), but this is not guaranteed across major versions

---

## 🌍 Accessibility Limitations

### 31. Screen Reader Support is Basic
- ARIA labels are present on key interactive elements
- But: dynamically generated content (duplicate groups, entry lists) may not be announced by screen readers
- Tab navigation works but focus management in modals could be improved

### 32. Color Contrast
- Dark mode glassmorphism may have insufficient contrast for some users
- The text-secondary color (#94a3b8) on dark backgrounds is borderline WCAG AA
- **Mitigation:** Users can switch to light mode for better contrast

### 33. No Internationalization (i18n)
- All text is in English only
- No translation support
- Date formats use `en-US` locale
- Right-to-left (RTL) languages are not supported

---

## 💡 What PwdCleaner is NOT

| ❌ Not This | ✅ It IS This |
|-------------|---------------|
| A password manager | A duplicate cleaner & format converter |
| A cloud service | A local/offline tool |
| A team tool | A single-user utility |
| A permanent vault | A temporary workspace |
| A security audit tool | A basic health checker |
| A breach checker | A local password analyzer |

---

## 🛠️ Workarounds for Limitations

### For Large Vaults (10,000+ entries)
1. Import files one at a time instead of all at once
2. Use the search/filter to work with subsets
3. Export cleaned data, clear, then import the next batch

### For Cross-Device Use
1. Export encrypted `.pwdcleaner` file
2. Transfer via USB, email-to-self, or cloud storage
3. Import on the other device with the same passphrase

### For Maximum Security
1. Use a strong 20+ character passphrase
2. Enable "Auto-Clean After Export"
3. Close the browser tab immediately after exporting
4. Clear browser history and site data
5. Use in a private/incognito window

### For Format Compatibility
1. After export, open the file in a text editor to verify structure
2. Import a small test batch first before bulk import
3. Keep the original export file as backup

---

## 📞 Reporting Issues

Found a bug? Have a feature request?

- **GitHub Issues:** [github.com/SudhirDevOps1/PwdCleaner/issues](https://github.com/SudhirDevOps1/PwdCleaner/issues)
- **Email:** developer@example.com
- **Security issues:** Report privately via email (do NOT open public issues for security vulnerabilities)

---

## 📜 Disclaimer

PwdCleaner is provided **"as is"** without warranty of any kind. The authors are not responsible for any data loss, security breach, or damage resulting from the use of this tool. Always keep backups of your original password exports before using any cleaning tool.

---

**Last Updated:** April 2026  
**Version:** 2.1.0  
**Author:** [@SudhirDevOps1](https://github.com/SudhirDevOps1)
