"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Calendar, Bell, CalendarDays, Scissors, Tags, Package,
  BadgePercent, Gift, Crown, Users, UserCog, ShieldCheck, ShoppingCart,
  Boxes, Truck, Receipt, CreditCard, FileText, RotateCcw, BarChart3, LineChart,
  Ticket, UsersRound, Megaphone, Home, Info, Image as ImageIcon, MessageSquareQuote,
  UserSquare2, CircleHelp, Phone, Search, Settings, CalendarClock, Clock, Mail,
  Lock, ScrollText, Database, Menu, X, LogOut, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "../logo";
import { signOut } from "next-auth/react";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; roles?: string[] };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/calendar", label: "Calendar", icon: Calendar },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Bookings",
    items: [
      { href: "/admin/bookings", label: "All Bookings", icon: CalendarDays },
      { href: "/admin/bookings?status=CONFIRMED", label: "Confirmed", icon: CalendarDays },
      { href: "/admin/bookings?status=COMPLETED", label: "Completed", icon: CalendarDays },
      { href: "/admin/bookings?status=CANCELLED", label: "Cancelled", icon: CalendarDays },
      { href: "/admin/bookings?status=PENDING", label: "Waiting List", icon: Bell },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/services", label: "Services", icon: Scissors },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/packages", label: "Packages", icon: Package },
      { href: "/admin/offers", label: "Offers", icon: BadgePercent },
      { href: "/admin/gift-cards", label: "Gift Cards", icon: Gift },
      { href: "/admin/memberships", label: "Memberships", icon: Crown },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/staff", label: "Staff", icon: UserCog },
      { href: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/pos", label: "POS", icon: ShoppingCart },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/suppliers", label: "Suppliers", icon: Truck },
      { href: "/admin/expenses", label: "Expenses", icon: Receipt },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
      { href: "/admin/refunds", label: "Refunds", icon: RotateCcw },
      { href: "/admin/revenue-reports", label: "Revenue Reports", icon: BarChart3 },
      { href: "/admin/financial-reports", label: "Financial Reports", icon: LineChart },
    ],
  },
  {
    title: "Marketing",
    items: [
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
      { href: "/admin/referrals", label: "Referrals", icon: UsersRound },
      { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/admin/segments", label: "Customer Segments", icon: Users },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/website", label: "Homepage Content", icon: Home },
      { href: "/admin/website/about", label: "About Page", icon: Info },
      { href: "/admin/website/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/admin/website/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/website/team", label: "Team Profiles", icon: UserSquare2 },
      { href: "/admin/website/faq", label: "FAQ", icon: CircleHelp },
      { href: "/admin/website/contact", label: "Contact Information", icon: Phone },
      { href: "/admin/website/seo", label: "SEO Settings", icon: Search },
    ],
  },
  {
    title: "System",
    items: [
      {href: "/admin/settings", label: "Settings", icon: Settings},
      {href: "/admin/security/change-password", label: "Change Password", icon: Lock},
      { href: "/admin/settings/booking", label: "Booking Settings", icon: CalendarClock },
      { href: "/admin/settings/business-hours", label: "Business Hours", icon: Clock },
      { href: "/admin/settings/notifications", label: "Notification Settings", icon: Mail },
      { href: "/admin/settings/security", label: "Security", icon: Lock },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText, roles: ["OWNER"] },
      { href: "/admin/settings/backup", label: "Backup & Restore", icon: Database },
    ],
  },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    const base = href.split("?")[0];
    if (base === "/admin") return pathname === "/admin";
    return pathname === base || pathname.startsWith(base + "/");
  }

  const body = (
    <div className={cn("flex h-full flex-col bg-charcoal text-cream", collapsed ? "w-16" : "w-64")}>
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        {!collapsed ? (
          <div className="rounded-xl bg-cream/10 p-2">
            <LogoWordmark compact />
          </div>
        ) : (
          <span className="font-heading text-lg font-bold text-white">M</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-lg p-1.5 text-cream/60 transition hover:bg-white/10 hover:text-white lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3" aria-label="Admin">
        {NAV.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-cream/40">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.filter((item) => !item.roles || item.roles.includes(role)).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-rose-gold text-white"
                          : "text-cream/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 transition hover:bg-rose-gold/20 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">{body}</aside>

      <div className="flex items-center justify-between border-b border-charcoal/10 bg-charcoal p-3 text-cream lg:hidden">
        <LogoWordmark compact />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-cream hover:bg-white/10"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full" style={{ animation: "slide-in-left 0.3s ease-out" }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-white/10 p-1.5 text-cream"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
