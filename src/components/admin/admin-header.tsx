"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Bell, ChevronLeft, ChevronRight, Users, ShieldCheck, Mail,
  LayoutDashboard, Calendar, MessageSquareQuote, Home, Image, UserSquare2,
  CircleHelp, Phone, Globe, LogOut, Box, CreditCard, FileText, ShoppingCart,
  Settings, CalendarClock, ScrollText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "../logo";
import { signOut } from "next-auth/react";

export function AdminHeader() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/bookings": "Bookings",
    "/admin/services": "Services",
    "/admin/packages": "Packages",
    "/admin/customers": "Customers",
    "/admin/staff": "Staff",
    "/admin/settings": "Settings",
    "/admin/roles": "Roles",
    "/admin/calendar": "Calendar",
    "/admin/notifications": "Notifications",
    "/admin/website": "Website",
    "/admin/website/about": "About",
    "/admin/website/gallery": "Gallery",
    "/admin/website/testimonials": "Testimonials",
    "/admin/website/team": "Team",
    "/admin/website/faq": "FAQ",
    "/admin/website/contact": "Contact",
    "/admin/website/seo": "SEO",
    "/admin/pos": "POS",
    "/admin/inventory": "Inventory",
    "/admin/payments": "Payments",
    "/admin/invoices": "Invoices",
  };

  const title = pageTitles[pathname] ?? "Dashboard";

  const navGroups = [
    { title: "Overview", items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/calendar", label: "Calendar", icon: Calendar },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ]},
    { title: "Bookings", items: [
      { href: "/admin/bookings", label: "All Bookings", icon: Calendar },
      { href: "/admin/bookings?status=CONFIRMED", label: "Confirmed", icon: Calendar },
      { href: "/admin/bookings?status=COMPLETED", label: "Completed", icon: Calendar },
      { href: "/admin/bookings?status=CANCELLED", label: "Cancelled", icon: Calendar },
      { href: "/admin/bookings?status=PENDING", label: "Waiting List", icon: Bell },
    ]},
    { title: "Business", items: [
      { href: "/admin/services", label: "Services", icon: MessageSquareQuote },
      { href: "/admin/packages", label: "Packages", icon: MessageSquareQuote },
      { href: "/admin/offers", label: "Offers", icon: MessageSquareQuote },
      { href: "/admin/coupons", label: "Coupons", icon: MessageSquareQuote },
    ]},
    { title: "People", items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/staff", label: "Staff", icon: Users },
      { href: "/admin/roles", label: "Roles", icon: ShieldCheck },
    ]},
    { title: "Operations", items: [
      { href: "/admin/inventory", label: "Inventory", icon: Box },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
      { href: "/admin/pos", label: "POS", icon: ShoppingCart },
    ]},
    { title: "Website", items: [
      { href: "/admin/website", label: "Homepage", icon: Home },
      { href: "/admin/website/about", label: "About", icon: Home },
      { href: "/admin/website/gallery", label: "Gallery", icon: Image },
      { href: "/admin/website/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/website/team", label: "Team", icon: UserSquare2 },
      { href: "/admin/website/faq", label: "FAQ", icon: CircleHelp },
      { href: "/admin/website/contact", label: "Contact", icon: Phone },
    ]},
    { title: "System", items: [
      { href: "/admin/settings", label: "General", icon: Settings },
      { href: "/admin/settings/business-hours", label: "Business Hours", icon: CalendarClock },
      { href: "/admin/settings/notifications", label: "Notifications", icon: Mail },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ]},
  ];

  return (
    <>
      <div className="flex items-center justify-between border-b border-charcoal/10 bg-charcoal/95 px-3 py-2 text-cream lg:hidden">
        <div className="flex items-center gap-2">
          <LogoWordmark compact />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-cream hover:bg-white/10"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-2 text-cream hover:bg-white/10"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-charcoal/10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LogoWordmark compact />
          </div>
          <div className="ml-3 hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{title}</span>
            <span className="text-xs text-cream/40">·</span>
            <span className="truncate text-xs text-cream/60">
              {pathname.replace("/admin", "").replace(/\/$/, "") || "Overview"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-2 text-cream hover:bg-white/10"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <Link href="/" target="_blank" className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-cream/80 hover:bg-white/10 hover:text-white sm:block">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              View Website
            </span>
          </Link>
          <Link href="/admin/notifications" className="relative rounded-lg p-2 text-cream/80 hover:bg-white/10 hover:text-white" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-gold ring-2 ring-charcoal" />
          </Link>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-cream/80 hover:bg-white/10 transition hover:text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-gold/20 text-xs font-bold">
              {getUserNameInitial()}
            </div>
            <span className="hidden text-xs sm:block">{getUserName()}</span>
          </div>
          <button
            onClick={async () => { await signOut({ callbackUrl: "/" }); }}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-gold hover:bg-rose-gold/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col border-b border-charcoal/10 bg-charcoal text-cream lg:hidden">
          <div className="flex items-center justify-between p-3">
            <LogoWordmark compact />
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-cream hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-cream/40">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                            active ? "bg-rose-gold/20 text-rose-gold" : "text-cream/70 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={async () => { await signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 hover:bg-rose-gold/20 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function isActive(pathname: string, href: string) {
  const base = href.split("?")[0];
  if (base === "/admin") return pathname === "/admin";
  return pathname === base || pathname.startsWith(base + "/");
}

function getUserName() {
  if (typeof window !== "undefined") {
    const u = (window as any).__admin_user_name;
    if (u) return u;
  }
  return "Owner";
}

function getUserNameInitial() {
  if (typeof window !== "undefined") {
    const n = (window as any).__admin_user_name;
    if (n) return n.charAt(0).toUpperCase();
  }
  return "O";
}
