import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, CreditCard, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";
import { StatusBadge } from "@/components/badge";

export const metadata: Metadata = { title: "Customer Details" };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      user: true,
      bookings: { orderBy: { startsAt: "desc" }, take: 10, include: { service: true, package: true } },
      payments: { orderBy: { createdAt: "desc" } },
      memberships: { include: { membership: true } },
    },
  });

  if (!customer) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Customer not found.</p>
        <Link href="/admin/customers" className="btn-outline mt-4">Back to customers</Link>
      </div>
    );
  }

  const totalSpent = customer.payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="text-xs font-semibold text-rose-gold hover:underline">
          &larr; Back to customers
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          {customer.firstName} {customer.lastName}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Bookings</p>
          <p className="mt-2 text-2xl font-bold">{customer.bookings.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total spent</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600"><Price cents={totalSpent} /></p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Loyalty</p>
          <p className="mt-2 text-2xl font-bold text-rose-gold">{customer.loyaltyPoints}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Member since</p>
          <p className="mt-2 text-sm font-bold">{formatDate(customer.createdAt)}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Contact</h2>
        <p className="mt-2 text-sm">{customer.user.email}</p>
        <p className="text-sm text-muted">{customer.user.phone ?? "No phone"}</p>
        <p className="text-sm text-muted">{customer.address ?? "No address"} {customer.city ?? ""}</p>
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Booking history</h2>
        </div>
        {customer.bookings.length === 0 ? (
          <p className="p-6 text-sm text-muted">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {customer.bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                  <p className="text-xs text-muted">{formatDate(b.startsAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-rose-gold"><Price cents={b.totalCents} /></span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
