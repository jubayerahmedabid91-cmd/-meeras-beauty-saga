import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge, StatusBadge } from "@/components/badge";

export const metadata: Metadata = { title: "Staff Details" };

export default async function AdminStaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      user: true,
      bookings: { orderBy: { startsAt: "desc" }, take: 10, include: { customer: true, service: true, package: true } },
      availability: true,
      leaveRequests: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!staff) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Staff member not found.</p>
        <Link href="/admin/staff" className="btn-outline mt-4">Back to staff</Link>
      </div>
    );
  }

  const completed = staff.bookings.filter((b) => b.status === "COMPLETED").length;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/staff" className="text-xs font-semibold text-rose-gold hover:underline">
          &larr; Back to staff
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">
            {staff.firstName} {staff.lastName}
          </h1>
          <Badge tone={staff.isActive ? "rose" : "outline"}>{staff.isActive ? "Active" : "Inactive"}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">{staff.jobTitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Completed</p>
          <p className="mt-2 text-2xl font-bold text-rose-gold">{completed}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Commission rate</p>
          <p className="mt-2 text-2xl font-bold">{staff.commissionRate}%</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Hired</p>
          <p className="mt-2 text-sm font-bold">{formatDate(staff.hiredAt)}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Weekly availability</h2>
        {staff.availability.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Not configured.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-7">
            {staff.availability.map((a) => (
              <div key={a.id} className="rounded-xl bg-pastel-pink p-3 text-center">
                <p className="text-xs font-semibold">{days[a.dayOfWeek]}</p>
                <p className="mt-1 text-[0.65rem] text-muted">
                  {a.isOff ? "Off" : `${a.startTime}–${a.endTime}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Recent bookings</h2>
        </div>
        {staff.bookings.length === 0 ? (
          <p className="p-6 text-sm text-muted">No bookings assigned.</p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {staff.bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                  <p className="text-xs text-muted">
                    {b.customer.firstName} {b.customer.lastName} · {formatDate(b.startsAt)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
