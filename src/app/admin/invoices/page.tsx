import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Invoices" };

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: { customer: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Invoices</h1>
          <p className="mt-1 text-sm text-muted">Invoices issued to customers.</p>
        </div>
        <Link href="/admin/invoices/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Create invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices" description="Invoices will appear here once created." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Invoice</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Issued</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-mono font-semibold">{inv.invoiceNumber}</td>
                  <td className="p-4">
                    {inv.customer.firstName} {inv.customer.lastName}
                  </td>
                  <td className="p-4 text-xs text-muted">
                    {new Date(inv.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold">{formatMoney(inv.totalCents)}</td>
                  <td className="p-4">
                    <Badge tone={inv.status === "PAID" ? "rose" : inv.status === "VOID" ? "outline" : "charcoal"}>
                      {inv.status}
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
