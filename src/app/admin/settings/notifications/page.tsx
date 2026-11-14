import type { Metadata } from "next";
import { Mail, MessageCircle, Bell, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Notification Settings" };

export default function AdminNotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Notification Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Configure how your team and customers receive notifications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">Email / SMTP</h2>
              <p className="text-xs text-muted">Booking confirmations, reminders</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            Not configured
          </p>
          <p className="mt-2 text-xs text-muted">
            Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and EMAIL_FROM in your .env file.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">WhatsApp</h2>
              <p className="text-xs text-muted">Instant booking alerts</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            Not configured
          </p>
          <p className="mt-2 text-xs text-muted">
            Set WHATSAPP_API_URL, WHATSAPP_API_TOKEN and WHATSAPP_PHONE_ID in your .env file.
          </p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-bold">In-app notifications</h2>
            <p className="text-xs text-muted">Shown inside the admin panel</p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-emerald-600">Active</p>
      </div>
    </div>
  );
}
