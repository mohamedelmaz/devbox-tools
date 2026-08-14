# DevBox Tools

<p align="left">
  <a href="https://mohamedelmaz.github.io/devbox-tools/"><img alt="Live Demo" src="https://img.shields.io/badge/demo-live-success"></a>
  <a href="https://github.com/mohamedelmaz/devbox-tools"><img alt="GitHub stars" src="https://img.shields.io/github/stars/mohamedelmaz/devbox-tools?style=social"></a>
  <a href="https://github.com/mohamedelmaz/devbox-tools/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue"></a>
</p>

**Your daily dev toolkit — fast, free, private.**

14 free, in-browser developer tools. No sign-up, no tracking, no server round-trips. Your data never leaves your device.

## Features

- **JSON Formatter & Validator** — Format, minify, validate JSON with stats
- **JSON ↔ YAML Converter** — Convert between JSON and YAML instantly
- **XML Formatter** — Format and validate XML structure
- **CSV Viewer & Editor** — View, edit, and export CSV/TSV/JSON
- **Regex Tester** — Test regex patterns with live matches and examples
- **Diff Tool** — Compare two texts side by side with line-level diffs
- **Code Minifier** — Minify and beautify HTML, CSS, and JS
- **Markdown Live Preview** — Write Markdown and preview HTML in real-time
- **JWT Decoder** — Decode and inspect JWT tokens
- **Hash Generator** — Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes
- **Password Generator** — Generate secure passwords with strength meter
- **UUID Generator** — Generate single or bulk UUIDs
- **Timestamp Converter** — Convert Unix timestamps to human-readable dates
- **Cron Expression Generator** — Visual cron builder with next run times

## Live Demo

https://mohamedelmaz.github.io/devbox-tools/

## Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks, no build step, no dependencies
- Web Crypto API for secure random values
- Service Worker for offline support (PWA)
- Responsive design with Dark Mode

## Installation

```bash
# Clone the repository
git clone https://github.com/mohamedelmaz/devbox-tools.git
cd devbox-tools

# Serve locally
python -m http.server 8080
# or
npx serve .
```

## Deployment

This project is designed for static hosting:

- **GitHub Pages** — enabled from the `main` branch, root folder
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the `dist` folder

## Privacy

DevBox Tools is privacy-first:

- All processing happens in your browser
- No analytics, no cookies, no external requests
- Uses Web Crypto API for cryptographic operations

## License

MIT — see [LICENSE](LICENSE)

## Contact

- Email: hello@devbox.tools
- GitHub: [@mohamedelmaz](https://github.com/mohamedelmaz)

## Part of WebTools Network

- [LinkQR Tools](https://mohamedelmaz.github.io/linkqr-tools/) — QR & Links
- [ShiftFile Tools](https://mohamedelmaz.github.io/shiftfile-tools/) — File Conversion
