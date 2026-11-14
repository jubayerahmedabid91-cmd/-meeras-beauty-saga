import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Packages" };

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Packages</h1>
          <p className="mt-1 text-sm text-muted">Manage packages, pricing and discounts.</p>
        </div>
        <Link href="/admin/packages/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add package
        </Link>
      </div>

      {packages.length === 0 ? (
        <EmptyState title="No packages" description="Add your first package to get started." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Package</th>
                <th className="p-4">Category</th>
                <th className="p-4">Items</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {packages.map((p) => (
                <tr key={p.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    <Link href={`/admin/packages/${p.id}`} className="font-semibold text-rose-gold hover:underline">
                      {p.name}
                    </Link>
                    {p.isFeatured && <span className="ml-2"><Badge tone="rose">Featured</Badge></span>}
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{p._count.items}</td>
                  <td className="p-4 font-semibold">{formatMoney(p.priceCents - p.discountCents)}</td>
                  <td className="p-4">{p.discountCents > 0 ? formatMoney(p.discountCents) : "-"}</td>
                  <td className="p-4">
                    <Badge tone={p.isActive ? "rose" : "outline"}>{p.isActive ? "Active" : "Inactive"}</Badge>
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
