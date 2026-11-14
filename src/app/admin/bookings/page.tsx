import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";

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
    include: { customer: true, service: true, package: true, staff: true },
  });

  const counts = await prisma.booking.groupBy({ by: ["status"], _count: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-muted">Manage all appointments and requests.</p>
        </div>
        <form className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search bookings..."
            className="field-input !pl-9"
          />
        </form>
      </div>

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
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Booking</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4">Staff</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
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
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-rose-gold" />
                      {formatDate(b.startsAt)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(b.startsAt)}
                    </p>
                  </td>
                  <td className="p-4">{b.staff ? `${b.staff.firstName} ${b.staff.lastName}` : "-"}</td>
                  <td className="p-4 font-semibold">{formatMoney(b.totalCents)}</td>
                  <td className="p-4">
                    <StatusBadge status={b.status} />
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
