import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  User,
  CreditCard,
  Heart,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata: Metadata = { title: "Customer Portal" };

const NAV = [
  { href: "/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer/bookings", label: "My Bookings", icon: Calendar },
  { href: "/customer/profile", label: "Profile", icon: User },
  { href: "/customer/payments", label: "Payments", icon: CreditCard },
  { href: "/customer/favourites", label: "Favourites", icon: Heart },
  { href: "/customer/loyalty", label: "Loyalty Points", icon: Sparkles },
  { href: "/customer/settings", label: "Settings", icon: Settings },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as { role?: string }).role;
  if (role !== "CUSTOMER") redirect("/auth/login");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-charcoal/10 bg-white p-4 lg:hidden">
        <LogoWordmark compact />
        <nav className="flex items-center gap-2">
          <Link href="/customer" className="btn-ghost !px-3 !py-2 text-xs">
            Menu
          </Link>
          <SignOutButton variant="topbar" />
        </nav>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal/10 bg-white lg:flex">
        <div className="border-b border-charcoal/10 p-5">
          <LogoWordmark compact />
        </div>
        <div className="border-b border-charcoal/10 p-5">
          <p className="text-xs text-muted">Welcome back,</p>
          <p className="text-sm font-bold">{firstName}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Customer">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition hover:bg-rose-gold/5 hover:text-rose-gold"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-charcoal/10 p-3">
          <SignOutButton variant="sidebar" />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
