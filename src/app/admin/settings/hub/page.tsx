import type { Metadata } from "next";
import { Settings, CalendarClock, Clock, Mail, Lock, Database } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">Configure your business, bookings and integrations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/settings", label: "General Settings", desc: "Business information, currency, timezone", icon: Settings },
          { href: "/admin/settings/booking", label: "Booking Settings", desc: "Buffer, advance notice, cancellation rules", icon: CalendarClock },
          { href: "/admin/settings/business-hours", label: "Business Hours", desc: "Opening hours and holidays", icon: Clock },
          { href: "/admin/settings/notifications", label: "Notification Settings", desc: "Email, WhatsApp and in-app alerts", icon: Mail },
          { href: "/admin/settings/security", label: "Security", desc: "Password policy and session settings", icon: Lock },
          { href: "/admin/settings/backup", label: "Backup & Restore", desc: "Database backups and restore points", icon: Database },
        ].map((s) => (
          <a key={s.href} href={s.href} className="card card-hover p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <s.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-bold">{s.label}</h2>
            <p className="mt-1 text-xs text-muted">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
