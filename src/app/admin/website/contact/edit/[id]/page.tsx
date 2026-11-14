import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Edit Contact Setting" };

export default async function ContactEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.contactMessage.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <AdminWebsiteForm
      resource="contact"
      action="edit"
      initialData={{
        key: c.name,
        label: c.name,
        value: c.message,
        isVisible: true,
      }}
      schema={websiteFormSchema}
      successMessage="Contact setting updated successfully."
    />
  );
}
