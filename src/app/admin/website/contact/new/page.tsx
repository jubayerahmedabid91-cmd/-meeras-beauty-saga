import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Add Contact Setting" };

export default async function ContactNewPage() {
  return (
    <AdminWebsiteForm
      resource="contact"
      action="create"
      initialData={{ key: "contact_address", label: "Address", value: "", isVisible: true }}
      schema={websiteFormSchema}
      successMessage="Contact setting added successfully."
    />
  );
}
