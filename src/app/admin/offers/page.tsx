import type { Metadata } from "next";
import { BadgePercent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Offers" };

export default async function AdminOffersPage() {
  const offers = await prisma.package.findMany({
    where: { discountCents: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });

  const coupons = await prisma.coupon.findMany({ where: { isActive: true } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Offers</h1>
        <p className="mt-1 text-sm text-muted">Discounted packages and active coupon codes.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Discounted packages</h2>
          </div>
          {offers.length === 0 ? (
            <p className="p-6 text-sm text-muted">No discounted packages.</p>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {offers.map((o) => (
                <li key={o.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{o.name}</p>
                    <p className="text-xs text-muted">
                      {formatMoney(o.priceCents - o.discountCents)}{" "}
                      <span className="line-through">{formatMoney(o.priceCents)}</span>
                    </p>
                  </div>
                  <Badge tone="rose">Save {formatMoney(o.discountCents)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Active coupons</h2>
          </div>
          {coupons.length === 0 ? (
            <p className="p-6 text-sm text-muted">No active coupons.</p>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {coupons.map((c) => (
                <li key={c.id} className="flex items-center justify-between p-4">
                  <span className="font-mono font-semibold">{c.code}</span>
                  <Badge tone="charcoal">
                    {c.type === "PERCENT" ? `${c.value}%` : formatMoney(c.value)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
