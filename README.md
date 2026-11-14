# Meera's – The Beauty Saga

A premium, production-ready beauty salon website and digital salon management system.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Prisma ORM** and **Auth.js (NextAuth v5)**.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Database](#database)
5. [Environment Variables](#environment-variables)
6. [Demo Accounts](#demo-accounts)
7. [Project Structure](#project-structure)
8. [Roles & Permissions](#roles--permissions)
9. [API Routes](#api-routes)
10. [Brand Assets](#brand-assets)
11. [Deployment](#deployment)
12. [Known Limitations](#known-limitations)

---

## Features

### Public Website
- Home page with hero, featured services, packages, gallery preview, bridal services, reviews and contact CTA
- About Us with brand story, mission and values
- Services catalogue with category filtering and detail pages
- Packages with category filtering, detail pages and comparison-ready layout
- Bridal Services page
- Gallery with category filtering
- Before & After gallery
- Our Team
- Customer Reviews
- Offers & Promotions
- Contact Us with working form (stored in database)
- FAQ
- Online Booking (multi-step wizard)
- Privacy Policy and Terms & Conditions

### Customer Portal (`/customer`)
- Dashboard with upcoming appointments, completed visits and loyalty points
- My Bookings (list + detail)
- Profile management (name, phone, DOB, gender, address, city)
- Payments & invoices
- Favourites (services and packages)
- Loyalty points, referral code and gift cards
- Account settings with password change

### Staff Portal (`/staff`)
- Dashboard with today's schedule, upcoming appointments and completed count
- My Appointments
- My Schedule (weekly availability)
- Leave Requests (submit + status tracking)

### Admin Panel (`/admin`)
- Dashboard with booking stats, revenue summary, upcoming and recent bookings
- Collapsible sidebar (desktop) + slide-in drawer (mobile), persisted state, grouped navigation, tooltips
- Bookings management with status filters, search and detail view with status actions
- Services management (create / edit / list)
- Packages management (create / edit / list)
- Categories, Coupons, Gift Cards, Memberships
- Customers (list + detail with booking history and spend)
- Staff (list + detail with availability and bookings)
- Payments, Invoices, Refunds
- POS (counter sales overview + product lookup)
- Inventory with low-stock alerts
- Finance (income, expenses, net) and Revenue / Financial reports
- Marketing (referrals, campaigns, segments)
- Website content management (gallery, testimonials, FAQ, team, contact, SEO)
- Settings (business info, regional, booking rules, business hours, notifications, security, backup)
- Roles & Permissions overview
- Audit Logs

### Booking Engine
- Multi-step booking wizard: service/package → date & time → details → review → confirm
- Real-time slot display, staff selection, add-ons (UI ready)
- Overlap prevention for the same staff member
- Duplicate booking protection via unique booking number
- Status workflow: Pending → Confirmed → Checked In → In Progress → Completed / Cancelled / No Show
- Waiting list schema ready

### Role-Based Access Control
- Six roles: Owner, Admin, Manager, Receptionist, Staff, Customer
- Server-side permission enforcement on every admin/staff/customer action
- Protected routes via middleware (auth) and layout checks (role)
- Audit log schema for sensitive actions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma ORM |
| Auth | Auth.js (NextAuth v5) with credentials provider |
| Validation | Zod |
| Icons | Lucide React + custom brand SVG icons |
| Animations | Lightweight CSS + IntersectionObserver (reduced-motion aware) |

---

## Getting Started

### Prerequisites
- Node.js 20+ (tested on Node 26)
- npm or pnpm

### Installation

```bash
cd app
npm install
cp .env.example .env
```

### Database Setup

```bash
# Create the SQLite database and run migrations
npx prisma migrate dev

# Load demo data (services, packages, demo accounts)
npx prisma db seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database

The schema is defined in `prisma/schema.prisma` and includes all entities required for the full system:

Users, Sessions, Role Permissions, Audit Logs, Customers, Staff, Service Categories, Services, Add-ons, Packages, Package Items, Bookings, Booking Items, Booking Staff, Staff Availability, Staff Schedules, Leave Requests, Staff Services, Waiting List, Business Settings, Holidays, Payments, Invoices, Products, Stock Movements, Suppliers, Purchases, Expenses, POS Sales, POS Sale Items, Coupons, Memberships, Customer Memberships, Loyalty Transactions, Gift Cards, Referrals, Reviews, Favourites, Notifications, Website Content, Gallery Images, Team Profiles, Testimonials, FAQs, Contact Messages and Support Tickets.

### Migrations

```bash
npx prisma migrate dev --name <migration-name>   # create + apply
npx prisma migrate deploy                        # production
```

### Switching to PostgreSQL

1. Update `DATABASE_URL` in `.env` to your PostgreSQL connection string.
2. Change the provider in `prisma/schema.prisma` to `postgresql`.
3. Run `npx prisma migrate dev` to apply the schema.

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Database connection string |
| `AUTH_SECRET` | NextAuth JWT secret (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Base URL of the app |
| `NEXT_PUBLIC_APP_URL` | Public site URL |
| `SMTP_*` | Email provider (optional) |
| `WHATSAPP_*` | WhatsApp provider (optional) |
| `PAYMENT_*` | Online payment provider (optional) |
| `AI_*` | Optional AI features |

---

## Demo Accounts

> These accounts are for local development only. Remove them before production deployment.

| Role | Email | Password |
|------|-------|----------|
| Owner | `owner@meerasdemo.com` | `Owner@12345` |
| Staff | `staff@meerasdemo.com` | `Demo@12345` |
| Customer | `customer@meerasdemo.com` | `Demo@12345` |

All demo data (services, prices, testimonials, packages) is clearly labelled and must be replaced with real business information.

---

## Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration files
│   └── seed.ts                # Demo seed data
├── public/
│   └── assets/
│       ├── logo.png           # Official logo (cropped circular badge)
│       └── web/               # Optimised brand photographs by category
│           ├── bridal/
│           ├── hair/
│           ├── makeup/
│           └── fashion/
├── src/
│   ├── app/
│   │   ├── (public pages)/    # Home, About, Services, Packages, ...
│   │   ├── auth/              # Login, Register, Forgot/Reset password
│   │   ├── customer/          # Customer portal
│   │   ├── staff/             # Staff portal
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── auth/              # Auth forms
│   │   ├── booking/           # Booking wizard
│   │   ├── cards/             # Service & package cards
│   │   ├── customer/          # Customer components
│   │   ├── home/              # Home page sections
│   │   └── staff/             # Staff components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config + helpers
│   │   ├── brand.ts           # Brand constants
│   │   ├── data.ts            # Data access helpers
│   │   ├── permissions.ts     # RBAC definitions
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utilities
│   └── types/
└── README.md
```

---

## Roles & Permissions

| Role | Access |
|------|--------|
| Owner | Full access to everything |
| Admin | Full access (explicitly granted by Owner) |
| Manager | Bookings, services, packages, POS, finance, marketing, website |
| Receptionist | Bookings, customers, POS, invoices |
| Staff | Own appointments, schedule, leave requests |
| Customer | Own bookings, profile, payments, favourites, loyalty |

Permissions are enforced server-side in every API route and layout. Hiding buttons is never the only protection.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/*` | — | NextAuth handlers |
| `/api/auth/register` | POST | Customer registration |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/bookings` | POST | Create a booking |
| `/api/contact` | POST | Submit contact message |
| `/api/customer/profile` | PUT | Update customer profile |
| `/api/customer/password` | PUT | Change password |
| `/api/staff/leave` | POST | Submit leave request |
| `/api/admin/services` | POST | Create service |
| `/api/admin/services/[id]` | PUT | Update service |
| `/api/admin/packages` | POST | Create package |
| `/api/admin/packages/[id]` | PUT | Update package |
| `/api/admin/staff` | POST | Create staff account |
| `/api/admin/settings` | PUT | Update business settings |
| `/api/admin/bookings/[id]/status` | PATCH | Update booking status |
| `/api/health` | GET | Health check |

---

## Brand Assets

All photographs and the logo are the supplied original brand assets for Meera's – The Beauty Saga.

- `public/assets/logo.png` — official logo (black circular badge with "Meera's The Beauty SAGA"), cropped to the inner circle with the outer dark background and bottom signature text removed
- `public/assets/web/` — optimised photographs organised by category (bridal, hair, makeup, fashion)
- `assets/web/` — source copies used to generate the public assets

**Important:** Do not replace the official logo with an invented logo. Do not distort, crop improperly or recolor the original logo. Do not use unrelated salon photographs in place of the supplied brand photographs.

---

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Checklist

- [ ] Replace demo accounts and remove them before launch
- [ ] Replace all demo prices with real, owner-approved pricing
- [ ] Configure SMTP for email notifications
- [ ] Configure WhatsApp provider (optional)
- [ ] Configure a payment provider (optional)
- [ ] Set `AUTH_SECRET` to a strong random value
- [ ] Set `DATABASE_URL` to PostgreSQL for production
- [ ] Run `npx prisma migrate deploy`
- [ ] Update business address, phone and WhatsApp
- [ ] Add real team profiles, testimonials and FAQs

---

## Known Limitations

| Feature | Status |
|---------|--------|
| Public website | Fully implemented |
| Customer portal | Fully implemented |
| Staff portal | Fully implemented |
| Admin panel | Implemented (core workflows functional) |
| Booking engine | Implemented (core flow functional) |
| Online payments | Awaiting payment provider configuration |
| Email / WhatsApp notifications | Awaiting provider configuration |
| AI features | Optional layer, disabled by default |
| Password reset emails | Requires SMTP configuration |
| POS terminal | Overview implemented; full cart flow pending |
| Advanced reporting | Basic charts implemented; advanced analytics pending |
| Physical device testing | Browser-based responsive tests only |

See `FEATURE_STATUS.md` for a detailed breakdown.
