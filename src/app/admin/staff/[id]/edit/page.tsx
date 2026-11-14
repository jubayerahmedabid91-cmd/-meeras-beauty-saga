import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StaffForm } from "@/components/admin/staff-form";

export const metadata: Metadata = { title: "Edit Staff" };

export default async function AdminEditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!staff) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/staff" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to staff
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          Edit {staff.firstName} {staff.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update this account&apos;s details, role, or password.
        </p>
      </div>

      <div className="card max-w-2xl p-6">
        <StaffForm
          mode="edit"
          staffId={staff.id}
          initial={{
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.user.email,
            phone: staff.phone ?? "",
            jobTitle: staff.jobTitle,
            role: staff.user.role,
            commissionRate: staff.commissionRate,
            isActive: staff.isActive && staff.user.isActive,
          }}
        />
      </div>
    </div>
  );
}
