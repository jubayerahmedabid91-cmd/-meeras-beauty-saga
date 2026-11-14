import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Add FAQ" };

export default async function FaqNewPage() {
  return (
    <AdminWebsiteForm
      resource="faq"
      action="create"
      initialData={{ question: "", answer: "", sortOrder: 0, isVisible: true }}
      schema={websiteFormSchema}
      successMessage="FAQ added successfully."
    />
  );
}
