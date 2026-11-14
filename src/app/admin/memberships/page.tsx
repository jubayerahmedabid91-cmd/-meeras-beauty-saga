import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Memberships" };

export default async function AdminMembershipsPage() {
  const memberships = await prisma.membership.findMany({
    orderBy: { priceCents: "asc" },
    include: { _count: { select: { customers: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Memberships</h1>
          <p className="mt-1 text-sm text-muted">Membership tiers and benefits.</p>
        </div>
        <Link href="/admin/memberships/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add membership
        </Link>
      </div>

      {memberships.length === 0 ? (
        <EmptyState title="No memberships" description="Create membership tiers for loyal customers." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memberships.map((m) => (
            <div key={m.id} className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{m.name}</h2>
                <Badge tone="rose">{m.tier}</Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-gold">{formatMoney(m.priceCents)}</p>
              <p className="text-xs text-muted">{m.discountPct}% discount on services</p>
              <p className="mt-3 text-sm text-muted">{m._count.customers} active member(s)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
