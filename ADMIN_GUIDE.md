# ADMIN_GUIDE.md — for the salon owner

Admin panel: `https://meeras-the-beauty-saga.netlify.app/admin`
Login: `https://meeras-the-beauty-saga.netlify.app/auth/login`

The sidebar keeps seven destinations: **Dashboard, Bookings, Calendar,
Services & Packages, Staff, Coupons, Settings.** On a phone you get a top bar
with a menu, a slide-in drawer, and a bottom tab bar.

---

## Log in
Enter your email and password. Use **Forgot password** if needed — this only
sends a real email once SMTP credentials are configured (see the note at the
bottom). After logging in, change your password under
**Settings → Change Password**.

## Dashboard
KPI cards: Today's revenue, Monthly revenue, Total bookings, Active staff, plus
a 14-day revenue/booking trend chart with a Revenue ⇄ Bookings toggle.
Revenue counts **paid** records only, in your configured currency.

## Bookings
- **Accept** / **Cancel** act immediately on a pending booking — no popup.
- The **Staff** column is a dropdown: pick a specialist and it saves at once.
- **WhatsApp** opens a pre-filled confirmation message; **Receipt** opens a
  printable invoice (Print / Save PDF).
- Use the status pills at the top to filter.

## Services & Packages
Create, edit, reorder, feature and archive. Prices and durations shown to
customers come straight from here.

## Staff
Add a specialist, set their role and specialisation, and activate/deactivate.
The number of **active** specialists decides how many bookings fit in one time
slot.

## Coupons
Create a code (percentage or flat amount), set a minimum spend, usage limit and
validity dates, then activate/deactivate or delete. Customers apply the code on
the last step of `/booking`; the discount is re-calculated on the server, so it
cannot be forged.

## Settings
- **Business information** — name, address, phone, WhatsApp, email. Empty fields
  are hidden from the website.
- **Regional** — currency, timezone, language.
- **Website claims** — tick only what is genuinely true; unticked claims are
  hidden from the site.
- **WhatsApp messages** — edit the pre-filled text for general, booking, service
  and bridal enquiries. `{name} {service} {date} {time} {ref}` are replaced
  automatically.
- **Brand & Logo** — paste a URL, or open the **Media Library** to upload.
- **Booking rules** — buffer, minimum advance notice, maximum advance days,
  cancellation notice.
- **Opening hours** — set per day; closed days are respected by availability.

## Website → Media Library
Upload photos (PNG/JPG/WEBP/GIF/SVG, up to 3 MB). Files are stored in your
database, so they survive redeploys. Use the **Brand logos** card to assign
header / footer / mobile / favicon images.

## Website content
Homepage, About, Gallery, Testimonials, Team, FAQ, Reviews moderation, Contact
information and SEO — all editable without touching code. Reviews and
testimonials only appear publicly once approved.

---

## Still needed from you
Business address · phone · WhatsApp number · email · opening hours · confirmed
currency and timezone · real client testimonials · genuine before/after photos.
Until a WhatsApp number is saved, the floating WhatsApp button stays hidden
rather than showing a made-up number.

Email delivery needs SMTP credentials in Netlify's environment variables —
without them the password-reset flow is built but cannot send.
