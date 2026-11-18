# PROJECT_SETUP.md — local setup

## Requirements
- Node.js 20.19+ / 22.12+ (Netlify uses Node 20)
- PostgreSQL (the live project uses Neon; any Postgres works)
- Windows note: run these commands in git-bash. Use `C:/Users/...` style paths
  for native tools.

## 1. Install
```bash
cd "C:/Users/JUBAYER/Downloads/Meeras-Beauty-Saga11/app"
npm ci
```

## 2. Environment
```bash
cp .env.example .env
```
Then set at least:
- `DATABASE_URL` — your Postgres connection string
- `AUTH_SECRET` — `openssl rand -base64 32`

Everything else is optional; the site runs without it.

## 3. Database
```bash
npx prisma generate
npx prisma migrate deploy     # applies migrations
npx tsx prisma/seed.ts        # initial content + owner account (first run only)
```

## 4. Run
```bash
npm run dev        # http://localhost:3000
```
Production-style run:
```bash
npm run build
npx next start -p 3000
```

## 5. First admin login
The seed creates the owner account. Use the credentials you set in the seed /
that were provided for the project. Change the password immediately after the
first login (Admin -> Change Password).

## 6. Stop the server
```bash
for P in $(netstat -ano | grep ":3000" | grep LISTENING | awk '{print $5}' | sort -u); do
  powershell -NoProfile -Command "Stop-Process -Id $P -Force"
done
```

## Common Windows gotchas
- `npm ci` can fail with `ENOTEMPTY` if a previous install was interrupted —
  delete `node_modules` and retry.
- `git push` needs `git -c credential.helper=manager push origin main`.
- Keep the local project folder backed up; the `.env` and `node_modules` are
  **not** in git.
