---
description: Commit current changes on main and push to trigger Cloudflare deploy
---

Commit the current working-tree changes on `main` and push to `origin/main` so the GitHub Actions deploy workflows (`deploy-frontend.yml` / `deploy-worker.yml`) fire and roll out to Cloudflare.

Steps:

1. Run these in parallel:
   - `git status` (no `-uall` flag)
   - `git diff` (staged + unstaged)
   - `git log -5 --oneline` to match commit message style
   - `git rev-parse --abbrev-ref HEAD` to confirm we're on `main`

2. If the current branch is not `main`, stop and tell the user — `/deploy` only runs from main.

3. If there's nothing to commit (clean tree, no untracked relevant files), stop and tell the user there's nothing to deploy.

4. Pull latest main with rebase so the push is fast-forward:
   - `git fetch origin main`
   - `git pull --rebase origin main`
   - If the rebase conflicts, stop and surface the conflict — do not auto-resolve.

5. Stage only the files that belong in this deploy:
   - Add specific paths by name (avoid `git add -A` / `git add .`).
   - Skip `.env*`, `.dev.vars*`, anything that looks like a secret or large binary the user didn't ask to commit. If unsure about a file, ask first.

6. Compose a concise commit message focused on the *why*, matching the recent log style (lowercase verb-led, ~70 chars on the subject line, no trailing period unless the existing log uses one). End with the standard co-author trailer:

   ```
   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   ```

   Pass the message via a HEREDOC.

7. Push:
   - `git push origin main`
   - Never use `--force` or `--force-with-lease` here. If push is rejected, stop and tell the user (probably means new commits landed remotely while we worked).

8. After push succeeds, report:
   - The new commit SHA + subject.
   - Which deploy workflow(s) the changed paths will trigger (`deploy-frontend.yml` runs on root/frontend changes; `deploy-worker.yml` runs on `workers/beta-signup/**` changes).
   - The GitHub Actions URL: `https://github.com/<owner>/<repo>/actions` — get owner/repo from `git remote get-url origin`.

Hard rules:
- Never bypass hooks (`--no-verify`, `--no-gpg-sign`). If a hook fails, fix the underlying issue and create a new commit.
- Never amend; always a fresh commit.
- Never touch git config.
- If the user passed arguments after `/deploy`, treat them as the commit subject (or a hint for it) — otherwise derive the subject from the diff.
