import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "Edit Service" };

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { addons: true },
  });
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Edit Service</h1>
        <p className="mt-1 text-sm text-muted">Update service details and pricing.</p>
      </div>
      <div className="card p-6">
        <ServiceForm
          initial={{
            name: service.name,
            slug: service.slug,
            categoryId: service.categoryId,
            description: service.description ?? "",
            durationMin: service.durationMin,
            priceCents: service.priceCents,
            isActive: service.isActive,
            isFeatured: service.isFeatured,
            imageUrl: service.imageUrl ?? "",
          }}
          serviceId={service.id}
        />
      </div>
    </div>
  );
}
