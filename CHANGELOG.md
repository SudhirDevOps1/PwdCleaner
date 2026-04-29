# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-06-01

### Added
- **Tab Navigation System** — Workspace, Health, Generator, Analyzer, Tools, Stats tabs
- **Password Strength Analyzer** — Deep analysis with 12 security checks, crack time estimation, and improvement suggestions
- **Password Generator** — Cryptographically secure (Web Crypto API), configurable length (8-128), character types, exclude ambiguous, batch generation
- **Password Health Dashboard** — Visual health score ring, weak/reused/strong/2FA/short password counts
- **Search & Filter** — Real-time search across all fields, filter by source manager and strength level
- **Detailed Statistics** — Source distribution, password length distribution, strength overview, top domains bar charts
- **Auto-Categorize** — Smart categorization into Social, Email, Shopping, Entertainment, Finance, Development, Gaming, etc.
- **Smart Merge** — Intelligent merging of same-site/same-user entries, combining notes and keeping best data
- **Backup & Restore** — Download encrypted JSON backups, restore from backup files
- **Remove Empty Entries** — Clean out entries with no password/username/URL
- **Normalize URLs** — Standardize all URLs (remove www, trailing slashes, ensure HTTPS)
- **Export Selected Entries** — Export only checked entries from filtered view
- **Edit Entry Modal** — Inline editing of any entry (name, URL, username, password, notes, group)
- **Undo System** — 30-second undo window for delete/clear operations
- **Batch Operations** — Select all filtered entries, batch delete, batch export
- **Import Mode Toggle** — Merge mode (default) or Replace mode for imports
- **Keyboard Shortcuts** — Ctrl+I (import), Ctrl+F (search), Ctrl+D (duplicates), Ctrl+E (export), Ctrl+G (generator), Ctrl+Z (undo), Ctrl+L (sample data)
- **Password Strength Dots** — Visual strength indicators (colored dots) next to every entry
- **Reused Password Detection** — Identifies passwords used on multiple sites
- **Weak Password Detection** — Common password list checking, pattern detection
- **Crack Time Estimation** — Estimates time to brute-force based on character set and length
- Enhanced stats bar with Weak Passwords and Reused Passwords counters
- New badge tags in hero section for Strength Analyzer and Password Generator

## [1.0.0] - 2024-01-01

### Added
- Initial release of Password Manager Duplicate Cleaner & Universal Format Converter
- Support for 40+ password manager and browser export formats
- Import formats: Chrome, Brave, Edge, Firefox, Safari, Opera, Vivaldi, Tor, Samsung Internet, UC Browser, Yandex Browser, DuckDuckGo, Bitwarden, Proton Pass, 1Password, LastPass, Dashlane, Keeper, NordPass, RoboForm, KeePass, Enpass, Zoho Vault, Sticky Password, LogMeOnce, RememBear, KeeWeb, Buttercup, LessPass, Passbolt, Padloc, TeamPass, Passwork, CommonKey, Myki, True Key, Intuitive Password, Password Boss, SplashID, mSecure, DataVault, Secrets, Codebook, Strongbox, Minimalist, Passky, Bitwarden_RS, Keychain
- Duplicate detection with multiple rules: exact match, website+username, website only, fuzzy domain
- Client-side AES-GCM encryption with PBKDF2 key derivation (100k iterations)
- Local storage encryption option
- Export cleaned data to any supported format
- Drag & drop file upload with multi-file support
- Auto-format detection (CSV/JSON/TXT/XML)
- Dark/Light mode toggle with glassmorphism UI
- PWA support with offline functionality
- Service Worker for cache-first offline access
- Toast notification system
- Share via WhatsApp, Twitter, LinkedIn (Web Share API)
- PWA install prompt
- Sample data demo
- Privacy-first: zero tracking, zero analytics, all processing client-side
- Developer contact information in footer
- GitHub Actions CI/CD for GitHub Pages deployment
- Responsive design for mobile, tablet, and desktop