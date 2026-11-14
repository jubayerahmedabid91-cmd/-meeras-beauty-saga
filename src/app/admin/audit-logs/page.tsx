import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Audit Logs" };

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted">
          Record of sensitive actions performed in the admin panel.
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="h-6 w-6" />}
          title="No audit logs"
          description="Actions like settings changes and deletions will be recorded here."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{log.action}</p>
                <p className="text-xs text-muted">
                  {log.entity} {log.entityId ? `#${log.entityId}` : ""} · by {log.user?.email ?? "system"}
                </p>
              </div>
              <span className="text-xs text-muted">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
