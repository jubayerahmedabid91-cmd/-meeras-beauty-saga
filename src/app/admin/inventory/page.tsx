import type { Metadata } from "next";
import { Boxes, AlertTriangle, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export const metadata: Metadata = { title: "Inventory" };

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { movements: true } } },
  });

  const lowStock = products.filter((p) => p.stockQty <= p.lowStockAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Inventory</h1>
          <p className="mt-1 text-sm text-muted">Product stock and movements.</p>
        </div>
        <Link href="/admin/inventory/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {lowStock.length > 0 && (
        <div className="card flex items-center gap-3 border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low on stock.
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={<Boxes className="h-6 w-6" />}
          title="No products"
          description="Add products to track inventory and sales."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4 text-xs text-muted">{p.sku}</td>
                  <td className="p-4">
                    <Badge tone={p.stockQty <= p.lowStockAt ? "outline" : "rose"}>
                      {p.stockQty} {p.unit}
                    </Badge>
                  </td>
                  <td className="p-4">{formatMoney(p.costCents)}</td>
                  <td className="p-4 font-semibold">{formatMoney(p.priceCents)}</td>
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
