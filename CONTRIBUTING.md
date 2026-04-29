# Contributing to Password Manager Duplicate Cleaner

Thank you for your interest in contributing! This project is privacy-first and open-source.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Open** `index.html` in a browser (no build step needed!)
4. Make your changes
5. **Test** thoroughly in multiple browsers
6. **Commit** with clear messages
7. **Push** to your fork
8. **Open a Pull Request**

## Code Style

- **No frameworks**: Pure vanilla HTML, CSS, and JavaScript only
- **No CDNs**: All code must be self-hosted
- **No tracking**: Zero analytics, cookies, or external requests
- Use **ES6+** syntax where supported
- Use **camelCase** for JavaScript variables and functions
- Use **BEM-style** naming for CSS classes where practical
- Keep functions **small and focused**
- Add **comments** for complex logic
- Follow **accessibility** best practices (ARIA labels, semantic HTML)

## Adding New Format Support

To add a new password manager format:

1. Add a parser function in `script.js` following the existing pattern
2. Register the format in the `FORMATS` object with name, extensions, and parser reference
3. Add the corresponding exporter if applicable
4. Test with sample data from the actual password manager
5. Update the README format list

## Reporting Issues

- Use GitHub Issues
- Include browser version and OS
- Describe steps to reproduce
- **Never** include actual passwords in issue reports

## Security

- Report security issues privately via email
- Do not open public issues for security vulnerabilities
- All password processing happens client-side only

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Contact

- Email: developer@example.com
- GitHub: https://github.com/PrivMITLab/pwd-cleaner