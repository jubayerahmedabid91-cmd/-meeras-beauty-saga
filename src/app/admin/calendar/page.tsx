import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";

export const metadata: Metadata = { title: "Calendar" };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selected = date ? new Date(date) : new Date();
  const dayOfWeek = selected.getDay();
  const dayLabel = DAYS[dayOfWeek];

  const start = new Date(selected);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: { startsAt: { gte: start, lt: end } },
    orderBy: { startsAt: "asc" },
    include: { customer: true, service: true, package: true, staff: true },
  });

  function shift(days: number) {
    const d = new Date(selected);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted">Daily schedule and appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/calendar?date=${shift(-1)}`} className="btn-outline !px-3 !py-2">
            &larr; Prev
          </Link>
          <Link
            href={`/admin/calendar`}
            className="btn-outline !px-3 !py-2 text-xs"
          >
            Today
          </Link>
          <Link href={`/admin/calendar?date=${shift(1)}`} className="btn-outline !px-3 !py-2">
            Next &rarr;
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Selected day</p>
            <p className="text-xl font-bold">
              {dayLabel}, {formatDate(selected)}
            </p>
          </div>
          <span className="rounded-full bg-rose-gold/10 px-3 py-1 text-sm font-semibold text-rose-gold">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-10 text-center text-sm text-muted">No bookings on this day.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/admin/bookings/${b.id}`}
              className="card flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                  <Clock className="h-4 w-4" />
                  <span className="text-[0.6rem] font-bold">{formatTime(b.startsAt)}</span>
                </div>
                <div>
                  <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                  <p className="text-xs text-muted">
                    {b.customer.firstName} {b.customer.lastName}
                    {b.staff && ` · ${b.staff.firstName} ${b.staff.lastName}`}
                  </p>
                </div>
              </div>
              <StatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
