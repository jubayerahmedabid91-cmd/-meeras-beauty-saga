import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";
import { StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { BookingRowActions } from "@/components/admin/booking-row-actions";
import { BookingCard } from "@/components/admin/booking-card";
import { StaffAssignSelect } from "@/components/admin/staff-assign-select";

export const metadata: Metadata = { title: "All Bookings" };

const STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const where = {
    ...(status && status !== "ALL" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { bookingNumber: { contains: q } },
            { customer: { firstName: { contains: q } } },
            { customer: { lastName: { contains: q } } },
          ],
        }
      : {}),
  };

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startsAt: "desc" },
    include: {
      customer: { include: { user: { select: { phone: true } } } },
      service: true,
      package: true,
      staff: true,
    },
  });

  const counts = await prisma.booking.groupBy({ by: ["status"], _count: true });

  const staffList = await prisma.staff.findMany({
    where: { isActive: true, user: { isActive: true } },
    orderBy: { firstName: "asc" },
    select: { id: true, firstName: true, lastName: true },
  });

  const staffOptions = staffList.map((s) => ({ id: s.id, name: `${s.firstName} ${s.lastName}` }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-muted">Manage all appointments and requests.</p>
        </div>
        <form className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search bookings..."
            className="field-input !pl-9"
          />
        </form>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/bookings"
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            !status ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-pastel-pink"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => {
          const count = counts.find((c) => c.status === s)?._count ?? 0;
          return (
            <Link
              key={s}
              href={`/admin/bookings?status=${s}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                status === s ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-pastel-pink"
              }`}
            >
              {s.replace("_", " ")} ({count})
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No bookings found"
          description="Bookings matching your filters will appear here."
        />
      ) : (
        <>
          {/* ── Mobile: full-width cards with 1-click actions ── */}
          <div className="space-y-3 lg:hidden">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                staff={staffOptions}
                booking={{
                  id: b.id,
                  bookingNumber: b.bookingNumber,
                  customerName: `${b.customer.firstName} ${b.customer.lastName}`,
                  customerPhone: b.customer.user.phone,
                  service: b.service?.name ?? b.package?.name ?? "-",
                  date: formatDate(b.startsAt),
                  time: formatTime(b.startsAt),
                  totalCents: b.totalCents,
                  discountCents: b.discountCents,
                  couponCode: b.couponCode,
                  status: b.status,
                  staffId: b.staff?.id ?? null,
                  staffName: b.staff ? `${b.staff.firstName} ${b.staff.lastName}` : null,
                  notes: b.notes,
                }}
              />
            ))}
          </div>

          {/* ── Desktop: full table ── */}
          <div className="card hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                  <th className="p-4">Booking</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Staff</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-pastel-pink/30">
                    <td className="p-4">
                      <Link href={`/admin/bookings/${b.id}`} className="font-semibold text-rose-gold hover:underline">
                        {b.bookingNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      {b.customer.firstName} {b.customer.lastName}
                    </td>
                    <td className="p-4">{b.service?.name ?? b.package?.name ?? "-"}</td>
                    <td className="p-4">
                      {formatDate(b.startsAt)}
                      <p className="mt-0.5 text-xs text-muted">{formatTime(b.startsAt)}</p>
                    </td>
                    <td className="p-4">
                      <StaffAssignSelect bookingId={b.id} value={b.staff?.id ?? null} staff={staffOptions} />
                    </td>
                    <td className="p-4 font-semibold"><Price cents={b.totalCents} /></td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-4">
                      <BookingRowActions
                        booking={{
                          id: b.id,
                          bookingNumber: b.bookingNumber,
                          customerName: `${b.customer.firstName} ${b.customer.lastName}`,
                          customerPhone: b.customer.user.phone,
                          service: b.service?.name ?? b.package?.name ?? "-",
                          date: formatDate(b.startsAt),
                          time: formatTime(b.startsAt),
                          totalCents: b.totalCents,
                          discountCents: b.discountCents,
                          couponCode: b.couponCode,
                          status: b.status,
                          staffName: b.staff ? `${b.staff.firstName} ${b.staff.lastName}` : null,
                          notes: b.notes,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
