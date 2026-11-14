import type { Metadata } from "next";
import { Bell, Mail, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Notifications" };

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
        <p className="mt-1 text-sm text-muted">
          Business alerts and messages. Email and WhatsApp integrations are configured in Settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Email</p>
            <p className="text-sm font-bold">Not configured</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">WhatsApp</p>
            <p className="text-sm font-bold">Not configured</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">In-app</p>
            <p className="text-sm font-bold">Active</p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="No notifications"
          description="Booking alerts and business notifications will appear here."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-4">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  n.isRead ? "bg-slate-100 text-slate-500" : "bg-rose-gold/10 text-rose-gold"
                }`}
              >
                {n.isRead ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <div>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted">{n.message}</p>
                <p className="mt-1 text-[0.65rem] text-muted">
                  {new Date(n.createdAt).toLocaleString()} · {n.channel}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
