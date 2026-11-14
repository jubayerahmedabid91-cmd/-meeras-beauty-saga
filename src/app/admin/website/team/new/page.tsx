import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { teamFormSchema } from "@/lib/team-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Add Team Profile" };

export default async function TeamNewPage() {
  return (
    <AdminWebsiteForm
      resource="team"
      action="create"
      initialData={{ staffId: "", name: "", role: "", bio: "", imageUrl: "", sortOrder: 0, isVisible: true }}
      schema={teamFormSchema}
      successMessage="Team profile added successfully."
    />
  );
}
