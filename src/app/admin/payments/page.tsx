import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Calendar, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, booking: { include: { service: true, package: true } } },
  });

  const total = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amountCents, 0);
  const pending = payments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Payments</h1>
        <p className="mt-1 text-sm text-muted">Payment records across the salon.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Collected</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{formatMoney(total)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{formatMoney(pending)}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title="No payments yet"
          description="Payment records will appear here as they are created."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Client</th>
                <th className="p-4">Booking</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    {p.customer.firstName} {p.customer.lastName}
                  </td>
                  <td className="p-4">
                    {p.booking?.service?.name ?? p.booking?.package?.name ?? "-"}
                  </td>
                  <td className="p-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-rose-gold" />
                      {formatDate(p.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4 font-semibold">{formatMoney(p.amountCents)}</td>
                  <td className="p-4">
                    <Badge tone={p.status === "PAID" ? "rose" : p.status === "REFUNDED" ? "outline" : "charcoal"}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
