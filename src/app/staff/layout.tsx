import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  CalendarOff,
  LogOut,
  User,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoWordmark } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata: Metadata = { title: "Staff Portal" };

const NAV = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/schedule", label: "My Schedule", icon: Calendar },
  { href: "/staff/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/staff/leave", label: "Leave Requests", icon: CalendarOff },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as { role?: string }).role;
  if (!["STAFF", "OWNER", "ADMIN", "MANAGER"].includes(role ?? "")) redirect("/auth/login");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <div className="flex items-center justify-between border-b border-charcoal/10 bg-white p-4 lg:hidden">
        <LogoWordmark compact />
        <SignOutButton variant="topbar" />
      </div>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal/10 bg-white lg:flex">
        <div className="border-b border-charcoal/10 p-5">
          <LogoWordmark compact />
        </div>
        <div className="border-b border-charcoal/10 p-5">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="text-sm font-bold">{firstName}</p>
          <span className="mt-2 inline-block rounded-full bg-rose-gold/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-rose-gold">
            Staff
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Staff">
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
