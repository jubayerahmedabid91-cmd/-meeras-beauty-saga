import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = await prisma.fAQ.findUnique({ where: { id } });
  if (!f) notFound();

  return (
    <AdminWebsiteForm
      resource="faq"
      action="edit"
      initialData={{
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
        isVisible: f.isVisible,
      }}
      schema={websiteFormSchema}
      successMessage="FAQ updated successfully."
    />
  );
}
