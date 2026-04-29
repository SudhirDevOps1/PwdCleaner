# Password Manager Duplicate Cleaner & Universal Format Converter

A privacy-first, offline-capable web application for cleaning duplicate passwords and converting between 40+ password manager formats. Built with pure vanilla HTML, CSS, and JavaScript — no frameworks, no CDNs, no tracking.

## Features

- **40+ Format Support**: Import/export from browsers and password managers
- **Duplicate Detection**: Multiple rules (exact, website+username, website only, fuzzy domain)
- **Password Strength Analyzer**: Deep analysis with 12 security checks, crack time estimation
- **Password Generator**: Cryptographically secure, configurable 8-128 chars, batch generation
- **Health Dashboard**: Visual score ring, weak/reused/strong/2FA metrics
- **Search & Filter**: Real-time search, filter by source and strength
- **Auto-Categorize**: Smart categorization (Social, Email, Shopping, Finance, etc.)
- **Smart Merge**: Intelligent merging of same-site entries
- **Backup & Restore**: Download/restore encrypted JSON backups
- **Edit Entries**: Inline modal editing of any entry
- **Undo System**: 30-second undo for all destructive actions
- **Keyboard Shortcuts**: Ctrl+I/F/D/E/G/Z/L for power users
- **Client-Side Encryption**: AES-GCM with PBKDF2 (100k iterations) for local storage
- **Offline-First**: PWA with Service Worker caching
- **Privacy-First**: All processing happens in your browser. Zero data leaves your device.
- **Glassmorphism UI**: Beautiful dark/light mode with responsive design
- **Detailed Statistics**: Source distribution, length charts, strength overview, top domains

## Supported Formats

### Browsers
Chrome, Brave, Edge, Firefox, Safari, Opera, Vivaldi, Tor, Samsung Internet, UC Browser, Yandex Browser, DuckDuckGo

### Password Managers
Bitwarden (CSV/JSON), Proton Pass (JSON), 1Password (1PUX/CSV), LastPass (CSV), Dashlane (CSV/JSON), Keeper (CSV), NordPass (CSV), RoboForm (CSV), KeePass (XML/CSV), Enpass (JSON/CSV), Zoho Vault (CSV), Sticky Password (CSV), LogMeOnce (CSV), RememBear (CSV), KeeWeb (JSON), Buttercup (JSON), LessPass (JSON), Passbolt (JSON), Padloc (JSON), TeamPass (CSV), Passwork (JSON), CommonKey (CSV), Myki (CSV), True Key (CSV), Intuitive Password (CSV), Password Boss (CSV), SplashID (CSV), mSecure (CSV), DataVault (CSV), Secrets (CSV), Codebook (CSV), Strongbox (CSV), Minimalist (JSON), Passky (JSON), Bitwarden_RS (JSON), Keychain (CSV), Generic CSV/JSON

## Quick Start

### Local Usage
1. Clone or download this repository
2. Open `index.html` in any modern browser
3. Import your password files
4. Select duplicate detection rule
5. Clean duplicates and export

### Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" > main
4. Your app will be live at `https://yourusername.github.io/pwd-cleaner/`

Or push to `main` branch — GitHub Actions CI/CD handles deployment automatically.

## How to Use

### Import
1. Drag & drop files onto the upload area, or click to browse
2. The app auto-detects the format (CSV, JSON, TXT, XML)
3. Multiple files can be imported simultaneously
4. Use "Load Sample Data" for a demo

### Duplicate Detection
1. Select your duplicate rule from the dropdown:
   - **Exact Match**: website + username + password all match
   - **Website + Username**: matches on site and user
   - **Website Only**: matches on domain/URL
   - **Fuzzy Domain**: matches similar domains (e.g., google.com == www.google.com)
2. Click "Find Duplicates"
3. Review groups in collapsible cards
4. Use "Keep First", "Mark Extras", "Select All", or manually select entries
5. Click "Delete Marked" to remove

### Export
1. Select the target format from the dropdown
2. Click "Export Cleaned Data"
3. File downloads automatically

### Encryption
1. Toggle the encryption switch
2. Set a master passphrase
3. Data is encrypted with AES-GCM (PBKDF2, 100k iterations)
4. Encrypted data stored in localStorage

## Privacy

- **Zero tracking**: No analytics, cookies, or external requests
- **Client-side only**: All processing in your browser
- **No data collection**: Nothing leaves your device
- **Open source**: Fully auditable code

See [privacy.html](privacy.html) for full privacy policy.

## Development

No build tools needed. Edit files directly:

```
/
├── index.html      # Main app page
├── styles.css      # All CSS styling
├── script.js       # All JavaScript logic
├── manifest.json   # PWA manifest
├── sw.js           # Service Worker
└── privacy.html    # Privacy policy
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License - See LICENSE file.

## Contact

- Email: developer@example.com
- LinkedIn: https://linkedin.com/in/developer
- Twitter: https://twitter.com/developer
- Website: https://privmitlab.github.io