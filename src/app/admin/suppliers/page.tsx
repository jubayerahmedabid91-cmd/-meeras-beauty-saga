import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "Suppliers" };

export default async function AdminSuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { purchases: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Suppliers</h1>
        <p className="mt-1 text-sm text-muted">Product suppliers and purchase records.</p>
      </div>

      {suppliers.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-6 w-6" />}
          title="No suppliers"
          description="Add suppliers to track purchases and inventory sources."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Supplier</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Purchases</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-semibold">{s.name}</td>
                  <td className="p-4 text-xs text-muted">
                    <p>{s.phone ?? "No phone"}</p>
                    <p>{s.email ?? "No email"}</p>
                  </td>
                  <td className="p-4">{s._count.purchases}</td>
                  <td className="p-4">
                    <Badge tone={s.isActive ? "rose" : "outline"}>{s.isActive ? "Active" : "Inactive"}</Badge>
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
