import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "Refunds" };

export default async function AdminRefundsPage() {
  const refunds = await prisma.payment.findMany({
    where: { status: "REFUNDED" },
    orderBy: { createdAt: "desc" },
    include: { customer: true, booking: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Refunds</h1>
        <p className="mt-1 text-sm text-muted">Refund records and processing.</p>
      </div>

      {refunds.length === 0 ? (
        <EmptyState
          icon={<RotateCcw className="h-6 w-6" />}
          title="No refunds"
          description="Refund records will appear here when processed."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {refunds.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {r.customer.firstName} {r.customer.lastName}
                </p>
                <p className="text-xs text-muted">{r.booking?.bookingNumber ?? "-"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-rose-600">${(r.amountCents / 100).toFixed(2)}</span>
                <Badge tone="outline">REFUNDED</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
