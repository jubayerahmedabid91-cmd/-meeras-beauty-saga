import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "My Appointments" };

export default async function StaffAppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const staff = await prisma.staff.findUnique({ where: { userId: session.user.id } });
  if (!staff) redirect("/auth/login");

  const bookings = await prisma.booking.findMany({
    where: { staffId: staff.id },
    orderBy: { startsAt: "desc" },
    include: { customer: true, service: true, package: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Appointments</h1>
        <p className="mt-1 text-sm text-muted">All appointments assigned to you.</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No appointments yet"
          description="Appointments assigned to you will appear here."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(b.startsAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(b.startsAt)} – {formatTime(b.endsAt)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  Client: {b.customer.firstName} {b.customer.lastName}
                </p>
                {b.notes && <p className="mt-1 text-xs text-muted">Notes: {b.notes}</p>}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
