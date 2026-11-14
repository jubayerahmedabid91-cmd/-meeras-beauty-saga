import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { services: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-muted">Organise your services into categories.</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add category
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories" description="Add categories to organise services." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Services</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-semibold">{c.name}</td>
                  <td className="p-4 text-xs text-muted">{c.slug}</td>
                  <td className="p-4">{c._count.services}</td>
                  <td className="p-4">
                    <Badge tone={c.isActive ? "rose" : "outline"}>{c.isActive ? "Active" : "Inactive"}</Badge>
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
