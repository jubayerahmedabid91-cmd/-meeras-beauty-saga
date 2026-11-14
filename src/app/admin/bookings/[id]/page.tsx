import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";

export const metadata: Metadata = { title: "Booking Details" };

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: { include: { user: true } },
      service: { include: { category: true } },
      package: true,
      staff: true,
      payment: true,
      items: { include: { service: true } },
    },
  });

  if (!booking) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Booking not found.</p>
        <Link href="/admin/bookings" className="btn-outline mt-4">Back to bookings</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/bookings" className="text-xs font-semibold text-rose-gold hover:underline">
          &larr; Back to bookings
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">Booking {booking.bookingNumber}</h1>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Appointment</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Service</dt>
                <dd className="font-semibold">
                  {booking.service?.name ?? booking.package?.name ?? "Appointment"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Category</dt>
                <dd className="font-semibold">{booking.service?.category.name ?? booking.package?.category ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Date</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <Calendar className="h-4 w-4 text-rose-gold" />
                  {formatDate(booking.startsAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Time</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-rose-gold" />
                  {formatTime(booking.startsAt)} – {formatTime(booking.endsAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Duration</dt>
                <dd className="font-semibold">{booking.durationMin} min</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Total</dt>
                <dd className="text-lg font-bold text-rose-gold">{formatMoney(booking.totalCents)}</dd>
              </div>
            </dl>
          </div>

          {booking.items.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold">Items</h2>
              <ul className="mt-4 space-y-2">
                {booking.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-semibold">{formatMoney(item.priceCents)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {booking.notes && (
            <div className="card p-6">
              <h2 className="text-lg font-bold">Customer notes</h2>
              <p className="mt-2 text-sm text-muted">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Client</h2>
            <p className="mt-3 font-semibold">
              {booking.customer.firstName} {booking.customer.lastName}
            </p>
            <p className="text-sm text-muted">{booking.customer.user.email}</p>
            <p className="text-sm text-muted">{booking.customer.user.phone ?? "No phone"}</p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold">Specialist</h2>
            <p className="mt-3 text-sm">
              {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : "Not assigned"}
            </p>
            {booking.staff && <p className="text-xs text-muted">{booking.staff.jobTitle}</p>}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold">Payment</h2>
            <p className="mt-3 text-sm">
              Status: <span className="font-semibold">{booking.payment?.status ?? "Not paid"}</span>
            </p>
            <p className="text-sm text-muted">Method: {booking.payment?.method ?? "-"}</p>
          </div>

          <BookingStatusActions bookingId={booking.id} status={booking.status} />
        </div>
      </div>
    </div>
  );
}
