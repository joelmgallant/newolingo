# Wapn — Project Guide

## What Is This

Wapn ("first light" in Mi'kmaw) is a Duolingo-style language learning app for Mi'kmaw (Mi'kmaq). Currently in the design/planning phase — no application code yet. The repo hosts design documents published as a GitHub Pages site.

- **Repo:** `github.com:joelmgallant/newolingo`
- **Branch:** `trunk`
- **GitHub Pages:** Served from `trunk` root via Jekyll remote theme (Cayman)

## Repository Structure

```
.
├── _config.yml                          # Jekyll config for GitHub Pages
├── .nojekyll                            # Marker file (not currently needed with Jekyll)
├── index.md                             # Landing page source (markdown)
├── index.html                           # Landing page (generated HTML)
├── docs/
│   ├── style.css                        # Shared stylesheet for all HTML pages
│   ├── template.html                    # Pandoc HTML template (includes mermaid support)
│   └── plans/
│       ├── 2026-03-08-wapn-design.md              # Full design document (source)
│       ├── 2026-03-08-wapn-design.html            # Full design document (generated)
│       ├── 2026-03-11-wapn-executive-summary-xfiles.md   # Executive summary (source)
│       └── 2026-03-11-wapn-executive-summary-xfiles.html # Executive summary (generated)
```

## Regenerating HTML After Changes

All HTML files are generated from markdown sources using **pandoc** with a custom template. After editing any `.md` file, regenerate the corresponding `.html`:

### Design document

```bash
pandoc docs/plans/2026-03-08-wapn-design.md \
  -o docs/plans/2026-03-08-wapn-design.html \
  --template=docs/template.html \
  --css=../../docs/style.css \
  --metadata title="Wapn — Design Document" \
  --standalone
```

### Executive summary (X-Files edition)

```bash
pandoc docs/plans/2026-03-11-wapn-executive-summary-xfiles.md \
  -o docs/plans/2026-03-11-wapn-executive-summary-xfiles.html \
  --template=docs/template.html \
  --css=../../docs/style.css \
  --metadata title="Wapn — Executive Summary" \
  --standalone
```

### Landing page

```bash
pandoc index.md \
  -o index.html \
  --template=docs/template.html \
  --css=docs/style.css \
  --metadata title="Wapn" \
  --standalone
```

### Publishing

After regenerating HTML:

```bash
git add -A
git commit -m "Regenerate HTML from updated sources"
git push
```

GitHub Pages will automatically deploy from `trunk`. The site updates within a minute or two of pushing.

## Key Conventions

- **Source of truth is markdown** — never edit `.html` files directly
- **No PDFs** — we removed PDF generation; HTML is the only output format
- **Pandoc template** at `docs/template.html` includes mermaid.js for diagram rendering
- **CSS** at `docs/style.css` supports both light and dark mode via `prefers-color-scheme`
- **Mermaid diagrams** in markdown use fenced code blocks with `mermaid` language tag
- **CSS path** is relative — plan docs use `../../docs/style.css`, index uses `docs/style.css`

## Adding New Documents

1. Create the markdown file in `docs/plans/` with naming convention: `YYYY-MM-DD-<topic>.md`
2. Generate HTML with pandoc using the template (follow the pattern above, adjust CSS path)
3. Add a link to the new doc in `index.md`
4. Regenerate `index.html`
5. Commit and push

## Tech Stack (Planned App — Not Yet Built)

- React Native (Expo) + TypeScript
- Zustand for state management
- SQLite (expo-sqlite) for offline-first storage
- Supabase for backend (auth, sync, audio CDN)
- Expo Router for navigation

See the full design document for complete architecture details.
