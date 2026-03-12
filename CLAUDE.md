# Wapn — Project Guide

## What Is This

Wapn ("first light" in Mi'kmaw) is a Duolingo-style language learning app for Mi'kmaw (Mi'kmaq). Currently in the design/planning phase — no application code yet. The repo hosts design documents published as a GitHub Pages site.

- **Repo:** `github.com:joelmgallant/newolingo`
- **Branch:** `trunk`
- **GitHub Pages:** Served from `trunk` root via Jekyll

## Repository Structure

```
.
├── _config.yml                          # Jekyll config (defaults, excludes)
├── _layouts/
│   └── default.html                     # HTML layout with mermaid.js support
├── Gemfile                              # Ruby dependencies (Jekyll 4.4)
├── index.md                             # Landing page source (markdown)
├── docs/
│   ├── style.css                        # Shared stylesheet (light + dark mode)
│   └── plans/
│       ├── 2026-03-08-wapn-design.md              # Full design document
│       └── 2026-03-11-wapn-executive-summary-xfiles.md   # Executive summary
```

## Local Development

```bash
bundle install          # First time only
bundle exec jekyll serve
```

Site is served at `http://localhost:4000` with auto-regeneration on file changes.

## Publishing

Just push markdown changes — Jekyll on GitHub Pages handles HTML generation:

```bash
git add -A
git commit -m "Update docs"
git push
```

GitHub Pages deploys from `trunk` automatically. No manual HTML generation needed.

## Key Conventions

- **Source of truth is markdown** — no generated HTML files in the repo
- **Layout** at `_layouts/default.html` includes mermaid.js for diagram rendering
- **CSS** at `docs/style.css` supports both light and dark mode via `prefers-color-scheme`
- **Mermaid diagrams** in markdown use fenced code blocks with `mermaid` language tag
- **Front matter** is required on all markdown pages (`layout: default` is set as a default in `_config.yml`, but `title` should be set per page)

## Adding New Documents

1. Create the markdown file in `docs/plans/` with naming convention: `YYYY-MM-DD-<topic>.md`
2. Add front matter with a title:
   ```yaml
   ---
   title: "Wapn — Your Title Here"
   ---
   ```
3. Add a link to the new doc in `index.md`
4. Commit and push

## Tech Stack (Planned App — Not Yet Built)

- React Native (Expo) + TypeScript
- Zustand for state management
- SQLite (expo-sqlite) for offline-first storage
- Supabase for backend (auth, sync, audio CDN)
- Expo Router for navigation

See the full design document for complete architecture details.
