import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Booking Details" };

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!customer) redirect("/auth/login");

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: customer.id },
    include: { service: true, package: true, staff: true, payment: true, items: { include: { service: true } } },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/customer/bookings" className="text-xs font-semibold text-rose-gold hover:underline">
          &larr; Back to bookings
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Booking {booking.bookingNumber}</h1>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
          <div>
            <p className="text-sm text-muted">Service</p>
            <p className="text-lg font-bold">{booking.service?.name ?? booking.package?.name}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Date</dt>
            <dd className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-rose-gold" />
              {formatDate(booking.startsAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Time</dt>
            <dd className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-rose-gold" />
              {formatTime(booking.startsAt)} – {formatTime(booking.endsAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Duration</dt>
            <dd className="text-sm font-semibold">{booking.durationMin} min</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Specialist</dt>
            <dd className="text-sm font-semibold">
              {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : "No preference"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total</dt>
            <dd className="text-lg font-bold text-rose-gold">{formatMoney(booking.totalCents)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Payment status</dt>
            <dd className="text-sm font-semibold">
              {booking.payment?.status ?? "Not paid"}
            </dd>
          </div>
        </dl>

        {booking.notes && (
          <div className="mt-5 rounded-xl bg-pastel-pink p-4">
            <p className="text-xs font-semibold text-rose-gold">Your notes</p>
            <p className="mt-1 text-sm">{booking.notes}</p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold">Need to change?</h2>
        <p className="mt-1 text-sm text-muted">
          To reschedule or cancel, please contact us at {BRAND.contact.phone} or through the Contact page.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-outline">Contact salon</Link>
          <Link href="/customer/bookings" className="btn-ghost">All bookings</Link>
        </div>
      </div>
    </div>
  );
}
