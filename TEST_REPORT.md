# TEST_REPORT.md

Environment: Node 26 / git-bash on Windows 11 · Next.js 16.4.6 production build
(`npx next start -p 3000`) · Neon PostgreSQL · Chromium via CDP for responsive
checks.

Test data was created and **deleted** after each test. No production business
record was modified or removed.

---

## 1. Build & static checks

| Test | Expected | Actual | Result |
|---|---|---|---|
| `npm run lint` | exit 0 | exit 0 — **0 errors**, 91 non-blocking warnings (was 10 errors) | ✅ |
| Dynamic Prisma delete via `?resource=user` | blocked | 400 "Invalid resource" (allowlist added) | ✅ |
| Login show/hide password control | present | button renders with aria-label | ✅ |
| `npm run build` | exit 0 | exit 0, 137 routes compiled | ✅ |
| Schema ↔ database drift | none | `prisma migrate diff` → "empty migration" | ✅ |
| Import case-sensitivity (Linux build) | 0 mismatches | 0 / 439 imports | ✅ |
| Unused `better-sqlite3` | none in code | only an optional peer dep declared by `prisma`; not installed | ✅ |

## 2. Route availability (local, HTTP)

| Route set | Expected | Actual | Result |
|---|---|---|---|
| 17 public routes | 200 / 307 | all 200 / 307 | ✅ |
| `/services/<slug>` (3 real slugs) | 200 | 200 | ✅ |
| `/admin/*` while unauthenticated | redirect | 307 → login | ✅ |
| `/api/media/<missing>` | 404 | 404 | ✅ |
| Server log after clean restart | no errors | 0 Prisma / runtime errors | ✅ |

## 3. Customer journeys

| Journey | Expected | Actual | Result |
|---|---|---|---|
| Services category filter | only matching category | 9 services → 1 for `?category=bridal-makeup` | ✅ |
| Gallery category filter | only matching category | `?category=bridal` → the 3 bridal images | ✅ |
| Offers page | no expired offers rendered | 200, none rendered | ✅ |
| Contact form | persisted | `{"ok":true}` (record deleted after) | ✅ |
| Booking: slot capacity | block when full | capacity 2 → 3rd booking rejected `SLOT_FULL` | ✅ |
| Availability after full slot | show full | `taken=2, remaining=0, available=false` | ✅ |
| Booking with coupon | discount applied + stored | subtotal $12.00 → discount $2.40 → total $9.60, `couponCode` persisted | ✅ |
| Homepage testimonials | render | "What Our Clients Say" present | ✅ |

## 4. Booking tracking security

| Case | Expected | Actual | Result |
|---|---|---|---|
| Reference only | blocked | "Enter the phone number or email used for the booking" | ✅ |
| Reference + wrong phone | no data | "No bookings" | ✅ |
| Reference + correct phone | booking shown | service + details shown | ✅ |
| `GET /api/customer/bookings/lookup?q=MB-…` | 400 without identity | 400 with the same message | ✅ |

## 5. Responsive checks (real Chromium, CDP device metrics)

| Widths | Pages | Horizontal overflow | Result |
|---|---|---|---|
| 320, 360, 375, 390, 414, 430 px | 14 public pages | **0** | ✅ |
| admin tables (13 pages with wide tables) | — | all inside `overflow-x-auto` | ✅ |
| admin mobile shell | — | sticky top bar, drawer, bottom tab bar, card layouts | ✅ |

## 5b. Visual audit (screenshots reviewed at 1440×900 and 390×844)

| Finding | Action |
|---|---|
| Desktop header showed **"Track Booking" twice** (nav item + icon button) | removed the duplicate icon button |
| Mobile drawer showed the same page in the nav list **and** as a CTA | removed the duplicate CTA |
| "Track", "Track Booking", "Track Booking Status" — three spellings for one page | unified to "Track Booking" |
| Hero trust chip "Signature looks" used a dark circular logo badge while its neighbours used line icons | switched to a `BadgeCheck` line icon for consistency |
| Homepage reused the same photos up to 5× | hero, lookbook and before/after now draw from distinct owner-supplied assets — distinct images 14 → 19, maximum reuse 5 → 4 |
| No broken images, no overlapping content, no horizontal overflow, contrast acceptable | — |

After the header fix the `<header>` markup contains exactly **one**
`/track-booking` link; the page contains two (desktop nav + mobile drawer nav).

## 6. Live deployment (Netlify)

| Check | Result |
|---|---|
| `GET /` | 200 |
| Testimonials section renders | ✅ |
| `/auth/login` | 200 |
| `/admin` unauthenticated | 307 (guard works) |
| `/admin` authenticated | 200, KPI cards render |
| Live media upload → `/api/media/<id>` | bytes identical to the uploaded file |
| Live booking + coupon | discount persisted |
| Live tracking reference-only | blocked |

---

## Failures found and fixed during testing

| Issue | Fix |
|---|---|
| `ColumnNotFound` on testimonials (schema drift) | added `testimonials.review_id` to Neon |
| Tracking exposed by reference alone | identity (phone/email) now required |
| Homepage reused the same photos up to 5× | hero, lookbook and showcase now use distinct owner-supplied assets (max reuse 4×, distinct images 14 → 19) |
| "Track", "Track Booking", "Track Booking Status" — three labels for one page | unified to "Track Booking" |

## Not tested / not verifiable here
- Real email delivery (no SMTP credentials).
- Real payment gateway (no credentials).
- WhatsApp Business API sending (no credentials).
- Third-party UIs (Google Maps embed) beyond their presence in the markup.
