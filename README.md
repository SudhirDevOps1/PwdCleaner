# 🔐 PwdCleaner — Password Duplicate Cleaner & Universal Format Converter

> **Privacy-first · Zero-knowledge · Offline · 40+ formats · AES-256-GCM encrypted**

Created by **[@SudhirDevOps1](https://github.com/SudhirDevOps1)**

[![GitHub Pages](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge&logo=github&logoColor=white)](https://sudhirdevops1.github.io/PwdCleaner/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![No Tracking](https://img.shields.io/badge/Zero-Tracking-red?style=for-the-badge)](https://sudhirdevops1.github.io/PwdCleaner/privacy.html)
[![Offline](https://img.shields.io/badge/Works-Offline-blue?style=for-the-badge)](https://sudhirdevops1.github.io/PwdCleaner/)

---

## 🚀 Live App

**👉 [https://sudhirdevops1.github.io/PwdCleaner/](https://sudhirdevops1.github.io/PwdCleaner/)**

Works on any device — desktop, tablet, mobile. No installation needed. Just open and use.

---

## 🤔 Why PwdCleaner?

If you've ever:
- Imported passwords from **multiple browsers** (Chrome, Firefox, Edge...)
- Switched between **password managers** (Bitwarden, LastPass, 1Password...)
- **Re-imported** your vault CSV/JSON and got duplicate entries
- Spent hours manually deleting duplicates

**PwdCleaner solves this in one click.** It finds exact duplicates, removes extras, and exports clean data back to your password manager's format.

---

## ✨ Features

### Core
- **40+ Format Support** — Import/export from Chrome, Firefox, Safari, Bitwarden, LastPass, 1Password, Dashlane, KeePass, Proton Pass, NordPass, RoboForm, and 30+ more
- **One-Click Auto Clean** — Finds all exact duplicates (same website + username + password) and removes extras
- **Smart Merge** — Merges entries sharing the same site + user, keeps best data, combines notes
- **4 Duplicate Rules** — Exact match, website+username, website only, fuzzy domain

### Security & Privacy
- **AES-256-GCM Encryption** — Encrypt vault files with your passphrase (PBKDF2 200k iterations)
- **Zero-Knowledge** — Only you know your passphrase. We cannot decrypt your files.
- **100% Offline** — Works without internet after first load (PWA + Service Worker)
- **Zero Tracking** — No analytics, no cookies, no external requests, no data collection
- **Lock Screen** — Master passphrase required to enter the app

### Tools
- **Password Generator** — Cryptographically secure, 8-128 chars, configurable character types
- **Password Strength Analyzer** — 12 security checks, crack time estimation, improvement suggestions
- **Health Dashboard** — Visual score ring, weak/reused/strong/2FA metrics
- **Search & Filter** — Real-time search, filter by source manager and strength level
- **Auto-Categorize** — Smart categorization (Social, Email, Shopping, Finance, etc.)
- **Batch Operations** — Select all, batch delete, batch export
- **Edit Entries** — Inline modal editing of any entry
- **Undo System** — 30-second undo for destructive actions
- **Auto-Clean After Export** — Automatically clears data after export download
- **Encrypted Data Terminal** — Inspect raw encrypted data to verify your passwords are truly unreadable

### Export
- Export to **16 formats**: Bitwarden CSV/JSON, Chrome, Firefox, LastPass, 1Password, Dashlane, KeePass, Proton Pass, NordPass, RoboForm, Enpass, Zoho Vault, Generic CSV/JSON

---

## 📖 How to Use

### Step 1: Enter Passphrase
Open the app → enter a master passphrase → click **Unlock & Enter**.

### Step 2: Import Passwords
- **Drag & drop** your exported CSV/JSON files, OR
- **Click to browse** and select files, OR
- Click **Load Sample Data** for a demo

### Step 3: Clean Duplicates
- Click **Auto Clean All Duplicates** for one-click cleanup, OR
- Select a **Duplicate Rule** → click **Find Duplicates** → review groups → **Delete Marked**

### Step 4: Export
- Select your desired **Export Format** from the dropdown
- Click **Export Cleaned Data**
- Import the clean file back into your password manager

### Encrypted File (Cross-Device)
1. Click **🔒 Download Encrypted File** — saves a `.pwdcleaner` file
2. Copy this file to USB / email / cloud
3. On another device: open PwdCleaner → enter same passphrase → **Import & Decrypt**
4. All your data is restored — works on any device, any browser

---

## 🛡️ Supported Formats (40+)

### Browsers
| Browser | Format |
|---------|--------|
| Chrome / Brave / Edge | CSV |
| Firefox | CSV |
| Safari | CSV |
| Opera | CSV |
| Vivaldi | CSV |
| Tor Browser | CSV |
| Samsung Internet | CSV |
| UC Browser | CSV |
| Yandex Browser | CSV |
| DuckDuckGo | CSV |

### Password Managers
| Manager | Format |
|---------|--------|
| Bitwarden | CSV, JSON |
| Proton Pass | JSON |
| 1Password | CSV, 1PUX |
| LastPass | CSV |
| Dashlane | CSV, JSON |
| Keeper | CSV |
| NordPass | CSV |
| RoboForm | CSV |
| KeePass | CSV, XML |
| Enpass | CSV, JSON |
| Zoho Vault | CSV |
| Sticky Password | CSV |
| LogMeOnce | CSV |
| RememBear | CSV |
| KeeWeb | JSON |
| Buttercup | JSON |
| LessPass | JSON |
| Passbolt | JSON |
| Padloc | JSON |
| TeamPass | CSV |
| Passwork | JSON |
| CommonKey | CSV |
| Myki | CSV |
| True Key | CSV |
| Intuitive Password | CSV |
| Password Boss | CSV |
| SplashID | CSV |
| mSecure | CSV |
| DataVault | CSV |
| Secrets | CSV |
| Codebook | CSV |
| Strongbox | CSV |
| Minimalist | JSON |
| Passky | JSON |
| Bitwarden_RS | JSON |
| Keychain | CSV |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, PWA manifest
- **CSS3** — Glassmorphism, dark/light mode, responsive grid, CSS variables
- **Vanilla JavaScript** — No frameworks, no libraries, no build tools
- **Web Crypto API** — AES-256-GCM encryption, PBKDF2 key derivation
- **Service Worker** — Offline-first caching
- **Zero dependencies** — Everything is self-hosted

---

## 📁 File Structure

```
PwdCleaner/
├── index.html              # Main application
├── styles.css              # All CSS (glassmorphism, responsive)
├── script.js               # All JavaScript (parsing, encryption, UI)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline caching)
├── privacy.html            # Privacy policy page (with live score)
├── PRIVACY.md              # Full privacy policy (15 sections)
├── README.md               # This file
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Contribution guidelines
├── robots.txt              # Search engine rules
├── sitemap.xml             # Sitemap
├── .gitignore              # Git ignore rules
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions CI/CD
├── extension/
│   ├── manifest.json       # Browser extension manifest
│   ├── popup.html          # Extension popup UI
│   └── icons/              # Extension icons (SVG)
└── lib/                    # Empty (future use)
```

---

## 🚀 Deployment

### GitHub Pages (Recommended)
```bash
git clone https://github.com/SudhirDevOps1/PwdCleaner.git
cd PwdCleaner
git push origin main
# GitHub Actions auto-deploys to https://sudhirdevops1.github.io/PwdCleaner/
```

### Local
```bash
git clone https://github.com/SudhirDevOps1/PwdCleaner.git
cd PwdCleaner
# Open index.html in any browser — that's it!
```

### Self-Hosted
Upload all files to any static web server (Nginx, Apache, Vercel, Netlify, Cloudflare Pages).

---

## 🔒 Privacy

- **Zero data collection** — We don't know you exist
- **Zero tracking** — No analytics, no cookies, no fingerprints
- **Zero external requests** — Everything runs in your browser
- **Client-side only** — No backend, no database, no API
- **Open source** — Every line of code is auditable

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

## 👤 Author

Created with ❤️ by **[@SudhirDevOps1](https://github.com/SudhirDevOps1)**

- GitHub: [github.com/SudhirDevOps1](https://github.com/SudhirDevOps1)
- LinkedIn: [linkedin.com/in/developer](https://linkedin.com/in/developer)
- Twitter: [twitter.com/developer](https://twitter.com/developer)
- Email: developer@example.com

---

> **Proton Pass team**, please bring an official auto duplicate removal and merge tool as soon as possible. Until then, use **PwdCleaner** 👉 [https://sudhirdevops1.github.io/PwdCleaner/](https://sudhirdevops1.github.io/PwdCleaner/)
