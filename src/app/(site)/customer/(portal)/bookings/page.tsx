import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "My Bookings" };

export default async function CustomerBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!customer) redirect("/auth/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: customer.id },
    orderBy: { startsAt: "desc" },
    include: { service: true, package: true, staff: true, payment: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Bookings</h1>
          <p className="mt-1 text-sm text-muted">View and manage your appointments.</p>
        </div>
        <Link href="/booking" className="btn-primary">
          <Calendar className="h-4 w-4" />
          New booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No bookings yet"
          description="When you book an appointment it will appear here."
          action={<Link href="/booking" className="btn-primary">Book now</Link>}
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{b.service?.name ?? b.package?.name ?? "Appointment"}</p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(b.startsAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(b.startsAt)}
                  </span>
                  {b.staff && <span>with {b.staff.firstName} {b.staff.lastName}</span>}
                </p>
                <p className="mt-1 text-xs text-muted">Ref: {b.bookingNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-rose-gold">{formatMoney(b.totalCents)}</span>
                <StatusBadge status={b.status} />
                <Link
                  href={`/customer/bookings/${b.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold"
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
