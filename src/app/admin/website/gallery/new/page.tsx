import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Add Gallery Image" };

export default async function GalleryNewPage() {
  return (
    <AdminWebsiteForm
      resource="gallery"
      action="create"
      initialData={{ src: "", alt: "", category: "", sortOrder: 0, isVisible: true }}
      schema={websiteFormSchema}
      successMessage="Gallery image added successfully."
    />
  );
}
