import type { Metadata } from "next";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "Staff" };

export default async function AdminStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const staff = await prisma.staff.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { jobTitle: { contains: q } },
          ],
        }
      : {},
    orderBy: { hiredAt: "desc" },
    include: {
      user: true,
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Staff</h1>
          <p className="mt-1 text-sm text-muted">Manage your team, roles and availability.</p>
        </div>
        <Link href="/admin/staff/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add staff
        </Link>
      </div>

      {staff.length === 0 ? (
        <EmptyState title="No staff" description="Add staff members to your team." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    <Link href={`/admin/staff/${s.id}`} className="font-semibold text-rose-gold hover:underline">
                      {s.firstName} {s.lastName}
                    </Link>
                  </td>
                  <td className="p-4">{s.jobTitle}</td>
                  <td className="p-4">
                    <p>{s.user.email}</p>
                    <p className="text-xs text-muted">{s.phone ?? "No phone"}</p>
                  </td>
                  <td className="p-4">{s._count.bookings}</td>
                  <td className="p-4">
                    <Badge tone={s.isActive ? "rose" : "outline"}>{s.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
