"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarDays, Calendar, Scissors, UserCog, Ticket,
  Settings, Menu, X, LogOut, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "../logo";
import { signOut } from "next-auth/react";

/**
 * The entire admin navigation shell — a single clean top bar on mobile with a
 * hamburger drawer + sticky bottom tab bar, and the classic dark sidebar on
 * desktop. Exactly 7 destinations, nothing else.
 */

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/services", label: "Services & Packages", icon: Scissors },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const BOTTOM_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
] as const;

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/calendar": "Calendar",
  "/admin/services": "Services",
  "/admin/packages": "Packages",
  "/admin/staff": "Staff",
  "/admin/coupons": "Coupons",
  "/admin/settings": "Settings",
  "/admin/notifications": "Notifications",
  "/admin/customers": "Customers",
  "/admin/website": "Website",
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  const base = href.split("?")[0];
  return pathname === base || pathname.startsWith(base + "/");
}

/** Best-matching title for any nested route (e.g. /admin/bookings/123 → "Bookings"). */
function pageTitleFor(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .filter((key) => key !== "/admin" && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : "Dashboard";
}

export function AdminShell({
  children,
  logoUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  const pageTitle = pageTitleFor(pathname);

  const navLinks = (onNavigate?: () => void, large?: boolean) =>
    NAV.map((item) => {
      const active = isActive(pathname, item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl font-semibold transition",
            large ? "px-4 py-3.5 text-base" : "px-3 py-2.5 text-sm",
            active
              ? "bg-rose-gold text-white shadow-soft"
              : "text-cream/70 hover:bg-white/10 hover:text-white",
          )}
        >
          <item.icon className={cn("shrink-0", large ? "h-5 w-5" : "h-4 w-4")} />
          <span className="truncate">{item.label}</span>
        </Link>
      );
    });

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* ── Mobile top bar (single, clean — replaces both old bars) ── */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-charcoal/10 bg-white px-2 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-xl p-2.5 text-charcoal transition hover:bg-pastel-pink"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <span className="text-base font-bold tracking-tight">{pageTitle}</span>
        </div>

        <div className="flex items-center">
          <Link
            href="/"
            target="_blank"
            className="rounded-xl p-2.5 text-charcoal/70 transition hover:bg-pastel-pink hover:text-charcoal"
            aria-label="View website"
          >
            <Globe className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl p-2.5 text-rose-gold transition hover:bg-rose-gold/10"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ── Desktop sidebar (dark, 7 items only) ── */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-charcoal text-cream lg:flex">
        <div className="border-b border-white/10 p-4">
          <div className="rounded-xl bg-cream/10 p-2">
            <LogoWordmark compact logoUrl={logoUrl} />
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
          {navLinks()}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-cream/70 transition hover:bg-rose-gold/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Page content (extra bottom padding clears the mobile tab bar) ── */}
      <div className="min-w-0 flex-1">
        <main className="px-4 py-5 pb-28 md:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Admin quick navigation"
      >
        <div className="grid h-16 grid-cols-4">
          {BOTTOM_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide transition",
                  active ? "text-rose-gold" : "text-muted hover:text-charcoal",
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "drop-shadow-sm")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Hamburger drawer (all 7 destinations) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-charcoal text-cream shadow-lift"
            style={{ animation: "slide-in-left 0.25s ease-out" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="rounded-xl bg-cream/10 p-2">
                <LogoWordmark compact />
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl p-2 text-cream/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin sections">
              {navLinks(() => setDrawerOpen(false), true)}
            </nav>
            <div className="border-t border-white/10 p-3">
              <Link
                href="/"
                target="_blank"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-cream/70 transition hover:bg-white/10 hover:text-white"
              >
                <Globe className="h-4 w-4" />
                View Website
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-cream/70 transition hover:bg-rose-gold/20 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
