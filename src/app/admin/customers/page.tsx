import type { Metadata } from "next";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { user: { email: { contains: q } } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-muted">All registered customers and their activity.</p>
        </div>
        <form className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Search customers..." className="field-input !pl-9" />
        </form>
      </div>

      {customers.length === 0 ? (
        <EmptyState title="No customers found" description="Customers will appear here as they register." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Loyalty</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    <Link href={`/admin/customers/${c.id}`} className="font-semibold text-rose-gold hover:underline">
                      {c.firstName} {c.lastName}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p>{c.user.email}</p>
                    <p className="text-xs text-muted">{c.user.phone ?? "No phone"}</p>
                  </td>
                  <td className="p-4">{c._count.bookings}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-rose-gold" />
                      {c.loyaltyPoints}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
