import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "Payments" };

export default async function CustomerPaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!customer) redirect("/auth/login");

  const payments = await prisma.payment.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { booking: { include: { service: true, package: true } } },
  });

  const invoices = await prisma.invoice.findMany({
    where: { customerId: customer.id },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Payments &amp; Invoices</h1>
        <p className="mt-1 text-sm text-muted">Your payment history and invoices.</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title="No payments yet"
          description="Your payment records will appear here after your first visit."
        />
      ) : (
        <div className="card">
          <div className="border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Payment history</h2>
          </div>
          <ul className="divide-y divide-charcoal/5">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">
                    {p.booking?.service?.name ?? p.booking?.package?.name ?? "Payment"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(p.createdAt).toLocaleDateString()} · {p.method}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-rose-gold"><Price cents={p.amountCents} /></span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {invoices.length > 0 && (
        <div className="card">
          <div className="border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Invoices</h2>
          </div>
          <ul className="divide-y divide-charcoal/5">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">{inv.invoiceNumber}</p>
                  <p className="mt-1 text-xs text-muted">
                    Issued {new Date(inv.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-rose-gold"><Price cents={inv.totalCents} /></span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {inv.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
