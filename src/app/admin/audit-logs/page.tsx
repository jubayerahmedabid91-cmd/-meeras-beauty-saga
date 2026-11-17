import type { Metadata } from "next";
import { ScrollText, ShieldAlert } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Audit Logs" };

export default async function AdminAuditLogsPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  // Super Admin only.
  if (role !== "OWNER") redirect("/admin");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Activity Log</h1>
          <p className="mt-1 text-sm text-muted">
            Who confirmed, edited or cancelled bookings and staff accounts.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-gold/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-rose-gold">
          <ShieldAlert className="h-3.5 w-3.5" />
          Super Admin only
        </span>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="h-6 w-6" />}
          title="No activity yet"
          description="Booking and staff changes will be recorded here."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">
                  {log.action.replace(/\./g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </p>
                <p className="text-xs text-muted">
                  {log.entity} {log.entityId ? `#${log.entityId}` : ""} · by{" "}
                  {log.user?.email ?? "system"}
                </p>
                {log.metadata && (
                  <p className="mt-1 line-clamp-1 text-[0.7rem] text-muted">{log.metadata}</p>
                )}
              </div>
              <span className="text-xs text-muted">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
