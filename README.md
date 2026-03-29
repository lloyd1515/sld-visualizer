# SLD Tree Visualizer

Interactive visualizer for SLD (Selective Linear Definite) resolution trees used in Prolog logic programming.

**Live:** [sld-visualizer.pages.dev](https://sld-visualizer.pages.dev)

## Features

- Visual SLD tree construction with nodes, clauses, and equations
- Clause management with labeled sub-goals
- Auto-computed result construction (bottom-up)
- Export/Import as JSON
- Export as PNG
- Multiple preset examples (member, conc, ancestor)

## Tech Stack

- **Frontend:** Single-file HTML/CSS/JS (no dependencies)
- **Hosting:** Cloudflare Pages

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run build
   ```

## Project Structure

```
├── src/
│   └── sld_visualizer.html      # Source HTML (single-file app)
├── public/
│   ├── index.html               # Built (obfuscated) — gitignored
│   └── data/
│       └── *.json               # Preset example trees
├── scripts/
│   └── build.js                 # Obfuscation build script
├── wrangler.toml.example        # Cloudflare config template
└── package.json
```

## Scripts

```bash
npm run build    # Build obfuscated HTML → public/index.html
npm run deploy   # Build + deploy to Cloudflare Pages
npm run dev      # Local dev server with live reload
```

## License

MIT
