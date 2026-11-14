import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PackageForm } from "@/components/admin/package-form";

export const metadata: Metadata = { title: "Edit Package" };

export default async function AdminEditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id }, include: { items: true } });
  if (!pkg) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Edit Package</h1>
        <p className="mt-1 text-sm text-muted">Update package details and pricing.</p>
      </div>
      <div className="card p-6">
        <PackageForm
          initial={{
            name: pkg.name,
            slug: pkg.slug,
            category: pkg.category,
            description: pkg.description ?? "",
            durationMin: pkg.durationMin,
            priceCents: pkg.priceCents,
            discountCents: pkg.discountCents,
            validityDays: pkg.validityDays,
            terms: pkg.terms ?? "",
            isActive: pkg.isActive,
            isFeatured: pkg.isFeatured,
            imageUrl: pkg.imageUrl ?? "",
          }}
          packageId={pkg.id}
        />
      </div>
    </div>
  );
}
