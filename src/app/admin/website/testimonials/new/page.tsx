import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { websiteFormSchema } from "@/lib/website-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Add Testimonial" };

export default async function TestimonialsNewPage() {
  return (
    <AdminWebsiteForm
      resource="testimonials"
      action="create"
      initialData={{ name: "", rating: 5, comment: "", imageUrl: "", isVisible: true }}
      schema={websiteFormSchema}
      successMessage="Testimonial added successfully."
    />
  );
}
