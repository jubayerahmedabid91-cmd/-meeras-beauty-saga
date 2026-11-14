import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function TestimonialsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  return (
    <AdminWebsiteForm
      resource="testimonials"
      action="edit"
      initialData={{
        name: t.name,
        rating: t.rating,
        comment: t.comment || "",
        imageUrl: t.imageUrl || "",
        isVisible: t.isVisible,
      }}
      schema={websiteFormSchema}
      successMessage="Testimonial updated successfully."
    />
  );
}
