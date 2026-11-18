# PROJECT_PROGRESS.md — Meera's · The Beauty Saga

Last update: 2026-11-18

## Completed in the latest pass

### Database
- Detected and repaired schema drift: added the missing `testimonials.review_id`
  column + unique index to Neon. Drift check now reports an **empty migration**.
- Confirmed every other table matches `prisma/schema.prisma`.

### Fixes
- `getBusinessSetting()` no longer drops plain-string settings (currency, phone,
  address, email now actually persist).
- Marketing claims are owner-gated and hidden by default.
- Test customers removed.

### Features shipped earlier in this workstream
- Media library + brand logo manager (upload, serve, logo slots).
- Configurable currency wired through the whole site and admin.
- WhatsApp message templates with placeholders.
- One-click booking accept/cancel + inline specialist assignment.
- Simplified 7-item admin sidebar; admin is mobile-first.
- Coupon manager applied at booking; VIP CRM; Super-Admin audit log.
- Executive KPI cards + 14-day revenue/booking trend chart.

## Tests executed (with results)

| Test | Result |
|---|---|
| `npm run build` | **exit 0** — 137 routes |
| `prisma migrate diff` (schema ↔ Neon) | empty (in sync) |
| 17 public routes over HTTP | all 200/307 |
| 3 service detail pages | all 200 |
| `server.log` after clean restart | 0 Prisma/runtime errors |
| Case-exact import scan (439 imports) | 0 mismatches |
| Mobile overflow, 6 widths × 14 public pages | 0 overflow |
| Admin wide-table guard scan (13 pages) | 0 unguarded |
| Live site | 200 |
| Live media upload → serve | bytes identical to uploaded file |
| Live booking with coupon | discount computed and stored (`couponCode` persisted) |

## Modified / added files (this pass)

```
prisma/schema.prisma                  (no net change — drift was in the DB)
.env.example                          (new)
PROJECT_AUDIT.md                      (new)
src/lib/data.ts                       plain-string settings fix
src/lib/media.ts                      (new) media library storage
src/app/api/media/[id]/route.ts       (new) public file serving
src/app/api/admin/media/route.ts      (new) upload
src/app/api/admin/media/[id]/route.ts (new) edit / delete
src/app/admin/website/media/page.tsx  (new) media library admin page
src/components/admin/media-library.tsx (new)
src/lib/salon.ts                      footer/mobile/favicon logo fields
src/components/site-header.tsx        mobile logo variant
src/components/site-footer.tsx        footer logo variant
src/app/layout.tsx                    owner favicon
```

## Remaining / blocked

See **PROJECT_AUDIT.md §5** — all remaining items need owner-provided business
data or third-party credentials. Nothing is claimed as active that is not.

## External configuration still required

Business contact details · WhatsApp number · confirmed currency/timezone ·
SMTP credentials · payment gateway keys · (optional) WhatsApp Business API.
See `.env.example`.
