import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { CouponRowActions } from "@/components/admin/coupon-row-actions";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";

export const metadata: Metadata = { title: "Coupons / Offers" };

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Coupons / Offers</h1>
          <p className="mt-1 text-sm text-muted">Discount codes and promotional offers.</p>
        </div>
        <Link href="/admin/coupons/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add coupon
        </Link>
      </div>

      {coupons.length === 0 ? (
        <EmptyState title="No coupons" description="Create coupon codes to offer discounts." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Uses</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-mono font-semibold">{c.code}</td>
                  <td className="p-4">{c.type}</td>
                  <td className="p-4">
                    {c.type === "PERCENT" ? `${c.value}%` : <Price cents={c.value} />}
                  </td>
                  <td className="p-4">
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="p-4">
                    <Badge tone={c.isActive ? "rose" : "outline"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="p-4">
                    <CouponRowActions id={c.id} isActive={c.isActive} />
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
