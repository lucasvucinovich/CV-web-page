# CV-web-page

Personal CV website of **Lucas A. Vucinovich** — bilingual (English / Español).

Live: https://lucasvucinovich.github.io/CV-web-page/

## Structure

- `index.html` — home (intro + featured project CareLoop)
- `aboutme.html`, `education.html`, `projects.html`, `skills.html`, `certifications.html`, `contact.html`
- `CSS/style.css` — all styles (design tokens at the top)
- `JS/main.js` — language switch, scroll animations, copy-to-clipboard
- `JS/i18n.js` — Spanish translations
- `docs/Lucas-Vucinovich-CV.pdf` — downloadable CV

## Editing text

English text lives directly in the HTML. Any element with `data-i18n="some.key"` gets its
Spanish version from `JS/i18n.js` under the same key — when you change English text, update
the matching Spanish entry too. A missing key prints a warning in the browser console.
