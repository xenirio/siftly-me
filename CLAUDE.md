# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

This is a two-package monorepo. The packages are deployed as **two separate Cloudflare Workers**:

- **Root** (`/`) — Vite + React marketing site for siftly.me. Built with `@cloudflare/vite-plugin` and deployed as a Worker that serves static assets (SPA, no routing logic). Config: `wrangler.jsonc`.
- **`workers/beta-signup/`** — Standalone Cloudflare Worker (`siftly-beta-signup`) handling `POST /api/beta`. Verifies a Turnstile token, mints a JWT against a Google service account, and appends the signup row to a Google Sheet. Config: `workers/beta-signup/wrangler.toml`.

Each package has its own `package.json` and `node_modules/`. Always run worker commands from `workers/beta-signup/` (or via the deploy npm script) — `wrangler` is installed locally per-package.

## Common commands

### Frontend (root)
```bash
npm run dev          # Vite dev server with /api proxied to localhost:8787
npm run build        # Production build → dist/
npm run preview      # Build then run wrangler dev locally
npm run deploy       # Build then wrangler deploy (siftly-me Worker)
```

### Beta-signup Worker (`workers/beta-signup/`)
```bash
npm run dev          # wrangler dev -c wrangler.toml --port 8787
npm run deploy       # wrangler deploy -c wrangler.toml
```

The `-c wrangler.toml` flag is required — wrangler 4 otherwise looks at the root `wrangler.jsonc` and gets the wrong project. Both npm scripts already include it; preserve the flag if you edit them.

### Local dev flow
1. In `workers/beta-signup/`: copy `.dev.vars.example` → `.dev.vars`, fill in `TURNSTILE_SECRET_KEY` and `GOOGLE_SERVICE_ACCOUNT_JSON`, then `npm run dev`.
2. In root: copy `.env.example` → `.env.local`, then `npm run dev`. The Vite dev server proxies `/api/*` to `127.0.0.1:8787` so the frontend can call the worker same-origin.

## Architecture notes

### Beta signup data flow
`CtaBand.jsx` renders the Turnstile widget explicitly via `window.turnstile.render`, captures the token in a ref, and POSTs `{ email, turnstileToken }` to `${VITE_API_BASE_URL}/api/beta` (empty = same-origin). The worker (`workers/beta-signup/src/index.js`) does it all in one fetch handler — no router, no framework. CORS allowlist is read from the `ALLOWED_ORIGINS` var (comma-separated). Service-account auth is implemented inline using `crypto.subtle` to RS256-sign a JWT and exchange it for an OAuth access token; the worker keeps no state.

### Frontend animations
`App.jsx` defines `useScrollReveal` and `useCollageParallax`. Reveal targets are listed in `REVEAL_SELECTORS`; adding a new element that should fade/rise on scroll means adding a selector + class pair there, not wiring up an observer per component. Both hooks respect `prefers-reduced-motion`.

### Secrets & vars
- **Frontend** (`VITE_*`): public, baked into the build. Set as GitHub Actions repo *variables* (`vars.VITE_TURNSTILE_SITE_KEY`, `vars.VITE_API_BASE_URL`) — see `.github/workflows/deploy-frontend.yml`.
- **Worker secrets**: `TURNSTILE_SECRET_KEY` and `GOOGLE_SERVICE_ACCOUNT_JSON` set via `wrangler secret put -c wrangler.toml <NAME>` (run from `workers/beta-signup/`). `GOOGLE_SERVICE_ACCOUNT_JSON` is the entire service-account JSON as a single string.
- **Worker vars** (non-secret): `SHEET_ID`, `ALLOWED_ORIGINS` live in `workers/beta-signup/wrangler.toml`.
- **CI secrets**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` for both deploy workflows.

### Deployments
Two GitHub Actions workflows (`.github/workflows/deploy-{frontend,worker}.yml`) auto-deploy on push to `main` based on changed paths. Both use `cloudflare/wrangler-action@v3`. The worker workflow runs from `workers/beta-signup/` and explicitly passes `-c wrangler.toml`.

## Gotchas

- Custom domain DNS for siftly.me/www.siftly.me is configured at Cloudflare; if local resolution fails, suspect router DNS cache rather than Cloudflare config.
- The frontend Worker uses `assets.not_found_handling: "single-page-application"` — there is no server-side routing for the marketing site.
