import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ROUTES } from "@/lib/brand";
import { getSalonProfile } from "@/lib/salon";
import { LogoMark } from "./logo";
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
  { href: ROUTES.trackBooking, label: "Track Booking" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.contact, label: "Contact Us" },
];

export async function SiteFooter() {
  const salon = await getSalonProfile();

  const socials = [
    { href: salon.social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: salon.social.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: salon.social.youtube, icon: YoutubeIcon, label: "YouTube" },
  ].filter((s) => Boolean(s.href));

  const contactRows = [
    { icon: MapPin, value: salon.address, href: null },
    {
      icon: Phone,
      value: salon.phone,
      href: salon.phone ? `tel:${salon.phone.replace(/\s/g, "")}` : null,
    },
    { icon: Mail, value: salon.email, href: salon.email ? `mailto:${salon.email}` : null },
    { icon: Clock, value: salon.openingHours, href: null },
  ].filter((row) => Boolean(row.value));

  return (
    <footer className="mt-auto bg-charcoal text-cream/85">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-2xl bg-white/5 p-4">
            <LogoMark className="h-11 w-11" logoUrl={salon.logoFooterUrl} />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            A premium beauty salon where every detail is crafted to make you feel radiant. Hair,
            makeup, bridal &amp; skin — by certified specialists.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition hover:border-rose-gold hover:bg-rose-gold hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
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
          {contactRows.length === 0 ? (
            <div className="mt-5 space-y-3 text-sm text-cream/60">
              <p>Contact details will appear here once configured in the admin panel.</p>
              <p>
                Meanwhile, use the{" "}
                <Link href={ROUTES.booking} className="underline hover:text-rose-gold-light">
                  booking form
                </Link>{" "}
                or the{" "}
                <Link href={ROUTES.contact} className="underline hover:text-rose-gold-light">
                  contact page
                </Link>{" "}
                to reach us.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-4 text-sm text-cream/70">
              {contactRows.map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
                  {href ? (
                    <a href={href} className="transition hover:text-rose-gold-light">
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream/60 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Meera&rsquo;s — The Beauty Saga. All rights reserved.
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
