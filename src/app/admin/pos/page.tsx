import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "POS" };

export default async function AdminPosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 20,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sales = await prisma.posSale.findMany({
    where: { createdAt: { gte: today, lt: tomorrow } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const todayTotal = sales.reduce((sum, s) => sum + s.totalCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Point of Sale</h1>
          <p className="mt-1 text-sm text-muted">Counter sales, receipts and daily records.</p>
        </div>
        <Link href="/admin/pos/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New sale
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Today&rsquo;s sales</p>
          <p className="mt-2 text-2xl font-bold text-rose-gold">{formatMoney(todayTotal)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Transactions</p>
          <p className="mt-2 text-2xl font-bold">{sales.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Products</p>
          <p className="mt-2 text-2xl font-bold">{products.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Recent sales</h2>
        </div>
        {sales.length === 0 ? (
          <p className="p-6 text-sm text-muted">No sales recorded today.</p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {sales.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{s.receiptNumber}</p>
                  <p className="text-xs text-muted">
                    {new Date(s.createdAt).toLocaleTimeString()} · {s.paymentMethod}
                  </p>
                </div>
                <span className="font-bold text-rose-gold">{formatMoney(s.totalCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Quick product lookup</h2>
        </div>
        {products.length === 0 ? (
          <p className="p-6 text-sm text-muted">No products added yet. Add products from Inventory.</p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted">{p.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="charcoal">{p.stockQty} in stock</Badge>
                  <span className="font-bold text-rose-gold">{formatMoney(p.priceCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
