import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Revenue Reports" };

export default async function AdminRevenueReportsPage() {
  const paid = await prisma.payment.findMany({ where: { status: "PAID" } });
  const byMonth: Record<string, number> = {};
  for (const p of paid) {
    const key = new Date(p.createdAt).toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] ?? 0) + p.amountCents;
  }
  const months = Object.keys(byMonth).sort();
  const max = Math.max(1, ...Object.values(byMonth));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Revenue Reports</h1>
        <p className="mt-1 text-sm text-muted">Monthly revenue from paid services and packages.</p>
      </div>

      {months.length === 0 ? (
        <div className="card flex items-center gap-3 p-6 text-sm text-muted">
          <BarChart3 className="h-5 w-5 text-rose-gold" />
          No paid revenue recorded yet.
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex h-48 items-end gap-3">
            {months.map((m) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold">{formatMoney(byMonth[m])}</span>
                <div
                  className="w-full rounded-t-lg bg-rose-gold"
                  style={{ height: `${Math.max(6, (byMonth[m] / max) * 160)}px` }}
                />
                <span className="text-xs text-muted">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
