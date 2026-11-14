import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { teamFormSchema } from "@/lib/team-form";
import { AdminWebsiteForm } from "@/components/admin/website-form";

export const metadata: Metadata = { title: "Edit Team Profile" };

export default async function TeamEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await prisma.teamProfile.findUnique({ where: { id } });
  if (!team) notFound();

  return (
    <AdminWebsiteForm
      resource="team"
      action="edit"
      initialData={{
        staffId: team.staffId || "",
        name: team.name,
        role: team.role,
        bio: team.bio || "",
        imageUrl: team.imageUrl || "",
        sortOrder: team.sortOrder,
        isVisible: team.isVisible,
      }}
      schema={teamFormSchema}
      successMessage="Team profile updated successfully."
    />
  );
}
