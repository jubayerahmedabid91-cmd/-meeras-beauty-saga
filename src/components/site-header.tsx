"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Calendar, User, LogIn, LayoutDashboard, Sparkles, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "./logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/bridal", label: "Bridal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/track-booking", label: "Track Booking" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ user }: { user: { role?: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const accountHref =
    user?.role === "OWNER" || user?.role === "ADMIN" || user?.role === "MANAGER"
      ? "/admin"
      : user?.role === "STAFF"
        ? "/staff"
        : "/customer";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled ? "border-charcoal/10 bg-cream/90 shadow-soft backdrop-blur-md" : "border-transparent bg-cream",
      )}
    >
      {/* Top strip */}
      <div className="hidden bg-charcoal text-cream md:block">
        <div className="container-site flex h-9 items-center justify-between text-xs">
          <p className="tracking-wide">Premium beauty salon &middot; Hair &middot; Makeup &middot; Bridal &middot; Skin</p>
          <div className="flex items-center gap-5 text-cream/80">
            <span>Mon &ndash; Sat &middot; 10:00 AM &ndash; 8:00 PM</span>
            <Link href="/contact" className="hover:text-rose-gold-light">Book a visit</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <LogoWordmark />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  active ? "text-rose-gold" : "text-charcoal hover:text-rose-gold",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-rose-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/track-booking"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-semibold transition md:text-sm",
              pathname === "/track-booking" ? "text-rose-gold" : "text-charcoal/70 hover:text-rose-gold",
            )}
          >
            <PackageSearch className="h-4 w-4" />
            Track
          </Link>
          <Link
            href="/booking"
            className="btn-primary hidden !px-5 !py-2.5 text-xs sm:inline-flex md:text-sm"
          >
            <Calendar className="h-4 w-4" />
            Book Now
          </Link>
          <Link
            href={user ? accountHref : "/auth/login"}
            className="btn-outline hidden !px-4 !py-2.5 text-xs sm:inline-flex md:text-sm"
          >
            {user ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {user ? "Dashboard" : "Sign In"}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-ghost !p-2.5 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            style={{ animation: "fade-in 0.25s ease-out" }}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-cream shadow-lift"
            style={{ animation: "slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
              <LogoWordmark compact />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost !p-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-5" aria-label="Mobile">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          active ? "bg-rose-gold/10 text-rose-gold" : "text-charcoal hover:bg-rose-gold/5",
                        )}
                      >
                        {item.label}
                        {active && <Sparkles className="h-4 w-4" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-charcoal/10 p-5">
              <Link href="/booking" className="btn-primary w-full">
                <Calendar className="h-4 w-4" />
                Book Appointment
              </Link>
              <Link href="/track-booking" className="btn-outline w-full">
                <PackageSearch className="h-4 w-4" />
                Track Booking Status
              </Link>
              <Link href={user ? accountHref : "/auth/login"} className="btn-dark w-full">
                {user ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {user ? "Go to Dashboard" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
