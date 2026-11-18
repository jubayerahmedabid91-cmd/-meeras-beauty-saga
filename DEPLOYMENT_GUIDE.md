# DEPLOYMENT_GUIDE.md — Netlify

Live site: https://meeras-the-beauty-saga.netlify.app
Repo: https://github.com/jubayerahmedabid91-cmd/-meeras-beauty-saga.git (`main`)

## How deployment works
Netlify builds on every push to `main` and publishes the result. The repo
contains `netlify.toml`:

```toml
[build]
  command = "npm run build"      # prisma generate && next build
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The build script deliberately does **not** run migrations or seeding — the
database is already migrated, and running DDL on every build would be fragile.

## Required Netlify environment variables
Set these in **Site settings → Environment variables** (never in the repo):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | **yes** | Neon Postgres connection string |
| `AUTH_SECRET` | **yes** | Random secret for sessions |
| `NEXT_PUBLIC_APP_URL` | recommended | `https://meeras-the-beauty-saga.netlify.app` |
| `SMTP_*`, `EMAIL_FROM` | optional | Enables real email sending |
| `PAYMENT_*` | optional | Enables a payment gateway |
| `WHATSAPP_API_*` | optional | Enables API messaging (wa.me links work without it) |

Every variable has a code fallback, so a missing one degrades gracefully instead
of crashing a function.

## Deploy checklist
1. `npm run build` locally → exit 0.
2. `git push origin main` (use `git -c credential.helper=manager push origin main` on Windows).
3. Wait for the Netlify build to finish.
4. Verify:
   - `GET /` → 200
   - `/admin` → 307 redirect to login (means the auth guard works)
   - `/auth/login` → 200
   - Upload a file in Admin → Media Library and confirm it renders.

## Serverless compatibility notes
- Database: Postgres through the pure-JS `pg` driver — no native addon, so it
  works in Netlify's Linux function runtime.
- File uploads: stored in the database, **not** on the local disk (Netlify's
  filesystem is read-only/ephemeral).
- Images: `images.unoptimized = true` so `next/image` does not depend on the
  Netlify image optimizer.
- No SQLite, no `better-sqlite3`, no filesystem writes at runtime.

## Rollback
Revert the commit and push, or use Netlify's own "Restore this deploy" — the
database is never touched by a deploy, so a rollback is safe for data.
