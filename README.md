# Code to Container — Workshop Prerequisites

An interactive, self-checking setup guide for the **Code to Container** Docker workshop. Students work through it once, before the session, to get Windows + WSL2 + Ubuntu + Docker Engine + Git/GitHub fully configured — so session time goes to building and deploying, not installing.

**Live site:** `https://<your-project-name>.pages.dev` *(update this link once deployed)*

## What this is

A static site with no build step, no dependencies, no backend — just `index.html`, `styles.css`, and `script.js`. It's deployed as a static site via Cloudflare Pages, connected directly to this repo for automatic redeploys on every push.

## What's inside

- **8 sequential setup steps**, each tagged by where it happens — Windows or Ubuntu (WSL terminal) — covering:
  - System / virtualization check
  - WSL2 + Ubuntu installation
  - Ubuntu user setup
  - Enabling systemd (so Docker starts automatically)
  - Installing Docker Engine (CLI only, no Docker Desktop)
  - Git config + GitHub CLI authentication (`gh auth login`)
  - VS Code + WSL extension
  - Final verification checks
- **Copy buttons** on every command block
- **Persistent checklist** — progress is saved in the browser via local storage, so students can close the tab and pick up where they left off
- **A troubleshooting section** for the most common failure points
- **A completion screen** with a countdown timer, shown once all 8 steps are checked off

## Editing

The site is split into three files — open them in any editor (or `code .` from WSL) and edit directly. No build tooling required.

- `index.html` — markup and content for the setup steps, troubleshooting, and completion screen
- `styles.css` — all styling, including the `:root` color/theme variables
- `script.js` — checklist persistence, copy buttons, and the countdown timer

**Before sharing with a new cohort**, update the countdown target date near the bottom of `script.js`:

```javascript
// TODO: replace with your actual session date and time before sharing.
const SESSION_DATE = new Date();
SESSION_DATE.setDate(SESSION_DATE.getDate() + 7);
SESSION_DATE.setHours(9, 0, 0, 0);
```

Replace with a fixed date, for example:

```javascript
const SESSION_DATE = new Date('2026-08-10T09:00:00');
```

## Deploying changes

This repo is connected to Cloudflare Pages. Any push to `main` triggers an automatic rebuild and redeploy — no manual steps needed:

```bash
git add index.html styles.css script.js
git commit -m "Update checklist"
git push
```

## Local preview

No server needed — just open `index.html` directly in a browser, or use VS Code's Live Server extension if you prefer auto-reload while editing.

## Attribution

Docker and the Docker logo are trademarks of Docker, Inc. This project is an independent workshop resource and is not affiliated with or endorsed by Docker, Inc.

---

© Ajeru 2026
