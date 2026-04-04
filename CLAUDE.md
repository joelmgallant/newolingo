# Wapn — Project Guide

## What Is This

Wapn ("first light" in Mi'kmaw) is a Duolingo-style language learning app for Mi'kmaw (Mi'kmaq). The repo hosts design documents (published as a GitHub Pages site) and the Expo app skeleton.

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
│   ├── mockups/                         # AI-generated high-fidelity UI mockups (PNG)
│   └── plans/
│       ├── 2026-03-08-wapn-design.md              # Full design document
│       ├── 2026-03-11-wapn-executive-summary-xfiles.md   # Executive summary
│       └── 2026-03-11-wapn-ui-mockups.md          # UI mockups (images + mermaid wireframes)
├── app/                                 # Expo (React Native) application
│   ├── app/                             # Expo Router file-based routes
│   │   ├── _layout.tsx                  # Root stack navigator
│   │   ├── lesson.tsx                   # Full-screen lesson/exercise flow
│   │   └── (tabs)/                      # Bottom tab navigator
│   │       ├── _layout.tsx              # Tab bar configuration
│   │       ├── index.tsx                # Home — skill tree / course path
│   │       ├── practice.tsx             # Practice — SRS review sessions
│   │       ├── dictionary.tsx           # Dictionary — searchable word bank
│   │       ├── leaderboard.tsx          # Leaderboard — weekly leagues
│   │       └── profile.tsx              # Profile — stats, achievements, settings
│   ├── components/                      # Reusable UI components
│   ├── constants/theme.ts               # Colors, fonts (Mi'kma'ki-inspired palette)
│   ├── hooks/                           # Custom React hooks
│   ├── store/user-store.ts              # Zustand store — user state, progress, word bank
│   └── types/                           # TypeScript type definitions
│       ├── content.ts                   # Course, Unit, Lesson, Exercise types
│       └── user.ts                      # UserProfile, Progress, Streak, Achievement types
```

## Local Development

### Docs Site (Jekyll)

```bash
bundle install          # First time only
bundle exec jekyll serve --no-watch
```

Site is served at `http://localhost:4000`.

**IMPORTANT:** Always use `--no-watch` when serving locally. Jekyll's auto-regeneration corrupts binary files (images in `docs/mockups/`) by rewriting them mid-copy, producing truncated/white images. After editing markdown, stop the server, run `bundle exec jekyll build`, then restart.

### Expo App

```bash
cd app
npm install             # First time only
npx expo start          # Start dev server
```

Press `i` for iOS simulator, `a` for Android emulator, `w` for web.

**Lint:** `npx expo lint` (ESLint with Expo config)

## Publishing

Just push markdown changes — Jekyll on GitHub Pages handles HTML generation:

```bash
git add -A
git commit -m "Update docs"
git push
```

GitHub Pages deploys from `trunk` automatically. No manual HTML generation needed.

## Key Conventions

### Docs
- **Source of truth is markdown** — no generated HTML files in the repo
- **Layout** at `_layouts/default.html` includes mermaid.js for diagram rendering
- **CSS** at `docs/style.css` supports both light and dark mode via `prefers-color-scheme`
- **Mermaid diagrams** in markdown use fenced code blocks with `mermaid` language tag
- **Front matter** is required on all markdown pages (`layout: default` is set as a default in `_config.yml`, but `title` should be set per page)

### App
- **Expo Router** for file-based navigation — add routes in `app/app/`
- **Zustand** for state management — stores in `app/store/`
- **TypeScript strict mode** enabled
- **Mi'kmaw text** uses apostrophes (') for vowel length — wrap in `{"string"}` in JSX to avoid lint errors
- **Theme** uses forest greens and earth tones inspired by Mi'kma'ki

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

## Tech Stack

- React Native (Expo SDK 54) + TypeScript
- Expo Router (file-based navigation)
- Zustand for state management
- SQLite (expo-sqlite) for offline-first storage
- expo-av for audio playback
- Supabase for backend (auth, sync, audio CDN) — not yet configured
- React Native Reanimated for animations

See the full design document for complete architecture details.
