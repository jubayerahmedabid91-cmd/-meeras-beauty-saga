import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { BRAND, ROUTES } from "@/lib/brand";
import { LogoWordmark } from "./logo";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./icons";

const EXPLORE = [
  { href: ROUTES.services, label: "Our Services" },
  { href: ROUTES.packages, label: "Packages" },
  { href: ROUTES.bridal, label: "Bridal Services" },
  { href: ROUTES.gallery, label: "Gallery" },
  { href: ROUTES.beforeAfter, label: "Before & After" },
  { href: ROUTES.team, label: "Our Team" },
];

const COMPANY = [
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.offers, label: "Offers & Promotions" },
  { href: ROUTES.reviews, label: "Customer Reviews" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.contact, label: "Contact Us" },
  { href: ROUTES.booking, label: "Book Appointment" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-charcoal text-cream/85">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-2xl bg-white/5 p-4">
            <LogoWordmark compact />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            {BRAND.description} Every detail is crafted to make you feel radiant.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[
              { href: BRAND.social.instagram, icon: InstagramIcon, label: "Instagram" },
              { href: BRAND.social.facebook, icon: FacebookIcon, label: "Facebook" },
              { href: BRAND.social.youtube, icon: YoutubeIcon, label: "YouTube" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href || "#"}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition hover:border-rose-gold hover:bg-rose-gold hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-gold-light">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/70 transition hover:text-rose-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-gold-light">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/70 transition hover:text-rose-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-gold-light">Visit Us</h3>
          <ul className="mt-5 space-y-4 text-sm text-cream/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <span>{BRAND.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <span>{BRAND.contact.phone}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <span>{BRAND.contact.email}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <span>{BRAND.contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream/60 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href={ROUTES.privacy} className="hover:text-rose-gold-light">
              Privacy Policy
            </Link>
            <Link href={ROUTES.terms} className="hover:text-rose-gold-light">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
