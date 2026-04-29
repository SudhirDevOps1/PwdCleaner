# Contributing to PwdCleaner

Thank you for your interest in contributing to **PwdCleaner**! 🎉

Created by [@SudhirDevOps1](https://github.com/SudhirDevOps1)

---

## 📌 How to Contribute

### 1. Fork & Clone
```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/PwdCleaner.git
cd PwdCleaner
```

### 2. Make Changes
- Open `index.html` in any browser — **no build step needed!**
- Edit `index.html`, `styles.css`, or `script.js` directly
- Test in multiple browsers (Chrome, Firefox, Safari)

### 3. Commit & Push
```bash
git add -A
git commit -m "feat: describe your change"
git push origin main
```

### 4. Open a Pull Request
- Go to the original repo on GitHub
- Click "New Pull Request"
- Describe your changes clearly

---

## 🎯 What to Contribute

### Welcome
- 🐛 Bug fixes
- ✨ New password manager format parsers
- 🌐 UI/UX improvements
- 📱 Mobile responsiveness fixes
- 🌍 Translations / i18n
- 📖 Documentation improvements
- 🧪 Test coverage
- ♿ Accessibility improvements

### Not Welcome
- ❌ External CDNs or frameworks
- ❌ Analytics or tracking scripts
- ❌ Backend servers or APIs
- ❌ Build tools (Webpack, Vite, etc.)
- ❌ TypeScript, React, Vue, Angular

---

## 📐 Code Style

### JavaScript
- **ES6+** syntax (arrow functions, `const`/`let`, template literals)
- **camelCase** for variables and functions
- **UPPER_SNAKE_CASE** for constants
- **No semicolons** required (but be consistent)
- Functions should be **small and focused**
- Add **comments** for complex logic

```javascript
// ✅ Good
function getDomain(url) {
  try {
    const u = url.startsWith('http') ? url : 'https://' + url;
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return url.toLowerCase();
  }
}

// ❌ Bad
function gd(u) { try { return new URL(u.includes('://') ? u : 'https://'+u).hostname.replace(/^www\./,'') } catch { return u.toLowerCase() } }
```

### CSS
- Use **CSS custom properties** (variables)
- **Mobile-first** responsive design
- **BEM-inspired** class names
- Group related styles together

### HTML
- **Semantic** elements (`<header>`, `<main>`, `<section>`, `<nav>`)
- **ARIA labels** for accessibility
- **No inline styles** (use CSS classes)

---

## 🔒 Security Rules

1. **Never** add external requests (CDNs, APIs, analytics)
2. **Never** use `eval()`, `innerHTML` with user input, or `document.write()`
3. **Always** sanitize user input before rendering
4. **Always** use `crypto.subtle` for encryption (never custom crypto)
5. Report security vulnerabilities **privately** via email

---

## 🧪 Testing

Before submitting a PR, test:
- [ ] Lock screen → unlock → app loads
- [ ] Import CSV from Chrome, Bitwarden, LastPass
- [ ] Import JSON from Bitwarden, Proton Pass
- [ ] Find duplicates → delete marked → export clean
- [ ] Encrypt file → download → import & decrypt
- [ ] Auto clean → verify count reduced
- [ ] Dark/light mode toggle
- [ ] Mobile responsiveness (phone + tablet)
- [ ] Keyboard shortcuts work
- [ ] No console errors

---

## 📝 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add KeePass XML parser
fix: Unicode password crash in togglePassword
docs: update README with new features
style: improve glassmorphism card shadows
refactor: extract encryption into separate functions
perf: reduce debounce for mobile search
chore: update CHANGELOG
```

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

## 💬 Questions?

- Open a [GitHub Issue](https://github.com/SudhirDevOps1/PwdCleaner/issues)
- Email: developer@example.com

---

**Thank you for helping make PwdCleaner better!** 🙏

— [@SudhirDevOps1](https://github.com/SudhirDevOps1)
