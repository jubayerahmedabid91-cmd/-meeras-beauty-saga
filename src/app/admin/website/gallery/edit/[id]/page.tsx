import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Edit Gallery Image" };

export default async function GalleryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await prisma.galleryImage.findUnique({ where: { id } });
  if (!g) notFound();

  return (
    <AdminWebsiteForm
      resource="gallery"
      action="edit"
      initialData={{
        src: g.src,
        alt: g.alt,
        category: g.category,
        sortOrder: g.sortOrder,
        isVisible: g.isVisible,
      }}
      schema={websiteFormSchema}
      successMessage="Gallery image updated successfully."
    />
  );
}
