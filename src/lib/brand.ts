// ────────────────────────────────────────────────────────────────────────────
// Meera's - The Beauty Saga :: Brand constants
// Colors, typography and shared copy. Everything here is owner-editable at
// runtime via the admin panel (business settings / website content).
// ────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Meera's",
  tagline: "THE BEAUTY SAGA",
  description:
    "A premium beauty salon offering hair, makeup, bridal and skin care services.",
  logo: "/assets/logo.png",
  // Official palette (from the approved brand identity)
  colors: {
    pastelPink: "#FFF0F3",
    cream: "#FAF7F5",
    charcoal: "#2E2E2E",
    roseGold: "#B76E79",
    white: "#FFFFFF",
    roseGoldDark: "#8F4A55", // accessible contrast variant for text/buttons
    roseGoldLight: "#E8C4CB",
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  },
  contact: {
    address: "To be provided by the owner",
    phone: "To be provided by the owner",
    whatsapp: "To be provided by the owner",
    email: "hello@meerasbeautysaga.com",
    hours: "Mon – Sat · 10:00 AM – 8:00 PM",
  },
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
  },
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  service: (slug: string) => `/services/${slug}`,
  packages: "/packages",
  package: (slug: string) => `/packages/${slug}`,
  bridal: "/bridal",
  team: "/team",
  gallery: "/gallery",
  beforeAfter: "/gallery/before-after",
  offers: "/offers",
  reviews: "/reviews",
  contact: "/contact",
  faq: "/faq",
  booking: "/booking",
  trackBooking: "/track-booking",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  customer: {
    dashboard: "/customer",
    bookings: "/customer/bookings",
    profile: "/customer/profile",
    payments: "/customer/payments",
    favourites: "/customer/favourites",
    loyalty: "/customer/loyalty",
    settings: "/customer/settings",
  },
  staff: {
    dashboard: "/staff",
    schedule: "/staff/schedule",
    appointments: "/staff/appointments",
    leave: "/staff/leave",
  },
  admin: {
    dashboard: "/admin",
    calendar: "/admin/calendar",
    bookings: "/admin/bookings",
    services: "/admin/services",
    packages: "/admin/packages",
    customers: "/admin/customers",
    staff: "/admin/staff",
    payments: "/admin/payments",
    pos: "/admin/pos",
    inventory: "/admin/inventory",
    finance: "/admin/finance",
    marketing: "/admin/marketing",
    website: "/admin/website",
    settings: "/admin/settings",
  },
} as const;
