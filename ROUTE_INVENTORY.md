# ROUTE_INVENTORY.md

Generated from the actual source tree (not from a supplied list).
Counts: **34 public route files**, **72 admin route files**, 137 routes compiled
by the production build.

Legend: 🔓 public · 🔒 requires a session · 🧩 dynamic segment

---

## Public website (route group `(site)`)

| Route | Title | Auth | Notes |
|---|---|---|---|
| `/` | (homepage) | 🔓 | hero, trust bar, featured services, about, packages, bridal, lookbook, before/after, gallery, reviews, contact |
| `/about` | About Us | 🔓 | |
| `/services` | Our Services | 🔓 | category filters (`?category=`) |
| `/services/[slug]` | service / "Service not found" | 🔓 🧩 | 404 state for unknown slug |
| `/packages` | Packages | 🔓 | |
| `/packages/[slug]` | package / "Package not found" | 🔓 🧩 | |
| `/bridal` | Bridal Services | 🔓 | |
| `/gallery` | Gallery | 🔓 | category filters |
| `/gallery/before-after` | Before & After | 🔓 | comparison slider |
| `/offers` | Offers & Promotions | 🔓 | expired offers hidden |
| `/booking` | Book Appointment | 🔓 | 4-step wizard |
| `/track-booking` | Track Booking | 🔓 | reference **+** phone/email |
| `/contact` | Contact Us | 🔓 | form → `POST /api/contact` |
| `/team` | Our Team | 🔓 | |
| `/reviews` | Customer Reviews | 🔓 | approved only |
| `/faq` | FAQ | 🔓 | accordion |
| `/privacy-policy` | Privacy Policy | 🔓 | |
| `/terms-and-conditions` | Terms & Conditions | 🔓 | |
| `/auth/login` | Sign In | 🔓 | credentials provider |
| `/auth/register` | Create Account | 🔓 | |
| `/auth/forgot-password` | Forgot Password | 🔓 | needs SMTP to send |
| `/auth/reset-password` | Reset Password | 🔓 | needs SMTP to send |

### Customer portal 🔒
`/customer` (dashboard), `/customer/bookings`, `/customer/bookings/[id]` 🧩,
`/customer/favourites`, `/customer/loyalty`, `/customer/payments`,
`/customer/profile`, `/customer/settings`

### Staff portal 🔒
`/staff` (dashboard), `/staff/appointments`, `/staff/leave`, `/staff/schedule`

---

## Admin panel

### Core
| Route | Title |
|---|---|
| `/admin` | Admin Dashboard |
| `/admin/bookings` | All Bookings |
| `/admin/bookings/[id]` 🧩 | Booking Details |
| `/admin/calendar` | Calendar |
| `/admin/services` · `/admin/services/new` · `/admin/services/[id]` 🧩 | Services CRUD |
| `/admin/packages` · `/admin/packages/new` · `/admin/packages/[id]` 🧩 | Packages CRUD |
| `/admin/staff` · `/admin/staff/new` · `/admin/staff/[id]` 🧩 · `/admin/staff/[id]/edit` 🧩 | Staff |
| `/admin/coupons` · `/admin/coupons/new` | Coupons / Offers |
| `/admin/customers` · `/admin/customers/[id]` 🧩 | Clients (CRM) |
| `/admin/settings` (+ `/booking`, `/business-hours`, `/notifications`, `/security`, `/hub`, `/backup`) | Settings |
| `/admin/security/change-password` 🔒 | Change Password |

### Content & media
`/admin/website`, `…/about`, `…/contact` (+`new`,`edit/[id]`), `…/faq` (+),
`…/gallery` (+), `…/media` (Media Library), `…/reviews` 🔒, `…/seo`,
`…/team` (+), `…/testimonials` (+)

### Operations & finance
`/admin/payments`, `/admin/invoices` (+`new`), `/admin/refunds`,
`/admin/pos` (+`new`), `/admin/finance`, `/admin/financial-reports`,
`/admin/revenue-reports`, `/admin/expenses`, `/admin/inventory` (+`new`),
`/admin/suppliers`, `/admin/gift-cards` (+`new`), `/admin/memberships` (+`new`),
`/admin/offers`, `/admin/categories` (+`new`), `/admin/notifications`

### People & system
`/admin/roles`, `/admin/segments`, `/admin/referrals`, `/admin/campaigns`,
`/admin/audit-logs`

---

## Public API endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/bookings` | create booking (server re-validates availability) |
| `GET /api/bookings/availability?date=` | slot availability for a date |
| `GET /api/customer/bookings/lookup?q=&id=` | booking lookup (identity-checked) |
| `POST /api/contact` | contact form |
| `GET /api/coupons/validate?code=&subtotalCents=` | live coupon check |
| `GET /api/media/[id]` | serve a media library file |
| `POST /api/admin/media` · `PATCH`/`DELETE /api/admin/media/[id]` | media management |
| `PATCH /api/admin/bookings/[id]/status` · `…/assign` | booking status / specialist |
| `PUT /api/admin/settings` | persist business settings |
| `POST /api/admin/coupons` · `PATCH`/`DELETE /api/admin/coupons/[id]` | coupons |
| `GET /api/health` | health probe |

## Notes / findings
- Every admin page sits under the `/admin` layout, which rejects anyone whose
  role is not OWNER / ADMIN / MANAGER / RECEPTIONIST.
- `/admin/audit-logs` is further restricted to **OWNER** at the page level.
- The public booking lookup is the only unauthenticated booking read path; it
  requires the reference **and** the booking's phone or email.
