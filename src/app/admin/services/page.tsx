import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = await prisma.serviceCategory.findMany({ orderBy: { sortOrder: "asc" } });

  const services = await prisma.service.findMany({
    where: category ? { category: { slug: category } } : {},
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Services</h1>
          <p className="mt-1 text-sm text-muted">Manage your service menu and pricing.</p>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add service
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/services"
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            !category ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-pastel-pink"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/services?category=${c.slug}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              category === c.slug ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-pastel-pink"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <EmptyState title="No services" description="Add your first service to get started." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    <Link href={`/admin/services/${s.id}`} className="font-semibold text-rose-gold hover:underline">
                      {s.name}
                    </Link>
                    {s.isFeatured && <span className="ml-2"><Badge tone="rose">Featured</Badge></span>}
                  </td>
                  <td className="p-4">{s.category.name}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-rose-gold" />
                      {s.durationMin} min
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{formatMoney(s.priceCents)}</td>
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
