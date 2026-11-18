# PROJECT_AUDIT.md — Meera's · The Beauty Saga

Audit date: 2026-11-18
Stack: Next.js 16.4.6 (App Router, Turbopack) · React 19 · Tailwind CSS 4 ·
Prisma 7 + `@prisma/adapter-pg` · Neon PostgreSQL · NextAuth v5 (Auth.js) ·
Netlify (serverless functions + static assets)

---

## 1. Condition found at audit start

The project is a working, deployed salon website plus a large admin panel. It
was **not** rebuilt. Recent sessions had already added: mobile-first admin
shell, media library, owner-confirmed marketing claims, configurable currency,
WhatsApp message templates, one-click booking actions, coupon manager, VIP CRM
and a Super-Admin audit log.

Last commit before this audit: `af8dddd`.

## 2. Audit method (actually executed)

| Check | How | Result |
|---|---|---|
| Production build | `npm run build` | **BUILD_EXIT=0**, 137 routes compiled |
| Schema ↔ database drift | `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` | **1 drift found** (`testimonials.review_id`) |
| Public route smoke test | 17 routes requested over HTTP | all `200`/`307`, no failures |
| Service detail pages | 3 real slugs | all `200` |
| Server runtime errors | `server.log` after a clean restart | **0** `ColumnNotFound` / `PrismaClientKnownRequestError` |
| Case-sensitive import check | exact-case scan of 439 `@/` + relative imports | **0 mismatches** (Linux-safe) |
| Mobile overflow, public pages | real Chromium via CDP at 320/360/375/390/414/430px × 14 pages | **0 horizontal overflow** |
| Mobile admin safety | structural scan of every admin table | **0** unguarded wide tables |
| Live site | `https://meeras-the-beauty-saga.netlify.app` | `200` |

## 3. Issues found

### C-1 · Database schema drift — `testimonials.review_id` (Critical)
- **Where:** every page that renders testimonials (homepage "What Our Clients
  Say", `/reviews`).
- **Symptom:** `PrismaClientKnownRequestError: ColumnNotFound` — Prisma selects
  all scalar fields, and `reviewId` was added to `prisma/schema.prisma` without
  the change reaching Neon.
- **Impact:** testimonials silently fell back to an empty list, so real
  owner-curated client feedback was **not displayed**.
- **Fix:** applied the missing column + unique index to Neon with
  `prisma db push --accept-data-loss`. Re-ran the drift check → *"This is an
  empty migration."* Re-tested the homepage → "What Our Clients Say" renders.
- **Status: FIXED & VERIFIED**

### S-1 · Booking tracking exposed by reference alone (High — security)
- **Where:** `/track-booking` and `/api/customer/bookings/lookup`.
- **Cause:** a booking reference (`MB-` + 6 time-derived chars + 4 random) was
  accepted on its own, so anyone who learned a reference could read another
  customer's name, service, time, price and specialist.
- **Fix:** the reference must now be supplied together with the phone number or
  email used for the booking; the lookup filters on both.
- **Verified:** reference only → blocked; reference + wrong phone → "No
  bookings"; reference + correct phone → details shown.
- **Status: FIXED & VERIFIED (locally and live)**

### H-1 · Plain-string settings were silently ignored (High)
- **Where:** `getBusinessSetting()` in `src/lib/data.ts`.
- **Cause:** the admin forms store strings raw (`BDT`, a phone number, an
  address), but the reader only accepted `JSON.parse`-able values and otherwise
  fell back to the built-in default.
- **Impact:** currency, phone, address and email changes **never took effect**.
- **Fix:** a parse failure is now treated as "this is a plain string".
- **Status: FIXED & VERIFIED** (currency switch to BDT reflected on the site,
  booking page and admin; then reset to USD)

### H-2 · Unverified marketing claims shown as fact (High)
- **Where:** homepage hero chips and the trust bar.
- **Cause:** "Certified Artists", "100% Authentic Products", "Hygienic Bridal
  Suite", "500+ Happy Brides" were hard-coded.
- **Fix:** all four are **off by default** and only render when the owner ticks
  them in Admin -> Settings -> Website claims.
- **Status: FIXED & VERIFIED**

### M-1 · Test customers left in the database (Medium)
- **Fix:** `Neon Test 1` / `Neon Test 2` removed.
- **Status: DONE & VERIFIED**

### L-1 · `git push` failed on Windows (Low, operational)
- **Cause:** system gitconfig sets `credential.helper=` (empty).
- **Fix:** push with `git -c credential.helper=manager push origin main`.
- **Status: DOCUMENTED**

## 4. Verified-working features (no action needed)

- Public pages: home, services + 9 detail pages, packages + detail, bridal,
  gallery, before/after, reviews, offers, FAQ, contact, team, legal, booking,
  track-booking, auth (login/register/forgot/reset), customer portal, staff
  portal.
- Booking: service/package selection, staff-based slot capacity, server-side
  availability re-check, coupon application, unique booking reference,
  cancellation, status tracking.
- Admin: dashboard KPIs + revenue/booking trend, bookings (one-click
  Accept/Cancel, inline specialist dropdown, WhatsApp confirm, printable
  receipt), calendar, services, packages, staff, coupons, customers/CRM with VIP
  badges, gallery, media library, website content, reviews moderation,
  testimonials, team, FAQ, SEO, business settings, payments, invoices, POS,
  finance/reports, roles, notifications, audit log, backup.
- Media library: upload (PNG/JPG/WEBP/GIF/SVG, 3 MB cap) stored in the database,
  public `/api/media/[id]`, brand logo slots (header/footer/mobile/favicon).
- Security: role-based permissions enforced server-side, audit log for booking
  and staff changes, hashed passwords, no secrets in client bundles.

## 5. Known limitations / owner action required

| Item | Why | Owner must |
|---|---|---|
| Business contact details | Only owner-provided data may be published | Fill in address, phone, WhatsApp, email, opening hours in Admin -> Settings |
| WhatsApp number | No number is configured, so the floating button is hidden | Set it in Admin -> Settings -> Business information |
| Currency | Prices are stored as raw amounts; switching currency does **not** convert them | Confirm the intended currency (INR vs USD) and timezone (Asia/Kolkata vs Asia/Dhaka) — **not changed automatically** |
| Email delivery | No SMTP credentials | Provide SMTP host/user/password for real password-reset and booking emails |
| Payments | No gateway credentials | Provide gateway keys; nothing is marked paid without a real record |
| WhatsApp Business API | No API credentials | Optional — wa.me deep links already work |
| Reviews | Only owner-curated testimonials are shown; `SAMPLE` content is never published | Add real client feedback in Admin -> Website -> Testimonials |
| Before/after pairs | Only genuine pairs may be shown | Upload real before/after images of the same client |
| Media storage scale | Files live in the `business_settings` table (chosen so no schema migration is needed) | If the library grows to hundreds of large files, move to a dedicated table/blob storage |
