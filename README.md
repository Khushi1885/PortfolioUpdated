# Khushi — AI / ML Portfolio

Clean, professional developer portfolio. No build tools — pure HTML, CSS, JavaScript.

## 📁 Project Structure

```
khushi-portfolio/
├── index.html        ← Main HTML
├── style.css         ← All styles
├── script.js         ← Cursor, animations, form
├── assets/
│   └── Khushi_Resume.pdf   ← Add your resume here
└── README.md
```

## 🚀 Running with Live Server (VS Code)

1. Install the **Live Server** extension by Ritwick Dey (Extensions panel, Ctrl+Shift+X)
2. Open the `khushi-portfolio/` folder in VS Code
3. Right-click `index.html` → **"Open with Live Server"**
   OR click **"Go Live"** in the bottom-right status bar
4. Site opens at `http://127.0.0.1:5500` and auto-reloads on save

## ✏️ Customising Content

| What | Where |
|---|---|
| Name, tagline, about text | `index.html` |
| GitHub / Demo URLs | `index.html` — each `<article class="proj-card">` |
| Skill percentages | `index.html` — `data-w="XX"` attributes |
| Resume PDF | Replace `assets/Khushi_Resume.pdf` |
| Social links | Footer + About section |
| Accent colour | `style.css` `:root` → `--accent` |

## 🔌 Flask Backend Connection

Update the fetch URL in `script.js` to your Flask server:

```js
const res = await fetch('http://localhost:5000/contact', { ... });
```

Flask should accept `{ name, email, message }` and return `{ "success": true }`.

## 🎨 Design

- Theme: Refined dark editorial
- Display: Fraunces (Google Fonts)
- Body: DM Sans (Google Fonts)  
- Accent: Sage-green `#6ee7b7` (minimal)
