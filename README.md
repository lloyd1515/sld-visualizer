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
- Built-in problem reporting

## Tech Stack

- **Frontend:** Single-file HTML/CSS/JS (no dependencies)
- **Hosting:** Cloudflare Pages
- **Backend:** Cloudflare Pages Functions (Workers)
- **Storage:** Cloudflare KV

## Setup

1. Clone the repo
2. Copy `wrangler.toml.example` to `wrangler.toml` and fill in your KV namespace ID
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a KV namespace:
   ```bash
   npx wrangler kv namespace create SLD_TRACKING
   ```
5. Set dashboard password as a secret:
   ```bash
   npx wrangler pages secret put DASHBOARD_PASSWORD --project-name sld-visualizer
   ```
6. Build and deploy:
   ```bash
   npm run deploy
   ```

## Project Structure

```
├── src/
│   └── sld_visualizer.html      # Source HTML (single-file app)
├── public/
│   ├── index.html               # Built (obfuscated) — gitignored
│   └── data/
│       └── *.json               # Preset example trees
├── functions/api/
│   ├── track.js                 # POST /api/track — logs visits & imports
│   ├── report.js                # POST /api/report — user problem reports
│   └── dashboard.js             # GET /api/dashboard — protected analytics
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
