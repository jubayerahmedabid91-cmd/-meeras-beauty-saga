import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, Star, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { Price } from "@/components/price";
import { StatusBadge, Badge } from "@/components/badge";
import { getSalonProfile } from "@/lib/salon";
import { CancelBookingButton, RescheduleRequestForm, ReviewForm } from "@/components/customer/booking-detail-actions";

export const metadata: Metadata = { title: "Booking Details" };

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: (session.user as { id: string }).id } });
  if (!customer) redirect("/auth/login");

  const [booking, salon] = await Promise.all([
    prisma.booking.findFirst({
      where: { id, customerId: customer.id },
      include: { service: true, package: true, staff: true, payment: true, items: { include: { service: true } } },
    }),
    getSalonProfile(),
  ]);
  if (!booking) notFound();

  const existingReview = await prisma.review.findUnique({ where: { bookingId: booking.id } });

  const isUpcoming = booking.startsAt > new Date();
  const canManage = ["PENDING", "CONFIRMED"].includes(booking.status) && isUpcoming;
  const isCompleted = booking.status === "COMPLETED";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/customer/bookings" className="text-xs font-semibold text-rose-gold hover:underline">
          <span aria-hidden="true">&larr;</span> Back to bookings
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
            <dd className="text-lg font-bold text-rose-gold"><Price cents={booking.totalCents} /></dd>
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

      {/* Manage: cancel / reschedule — only for upcoming, active bookings */}
      {canManage && (
        <div className="card p-6">
          <h2 className="text-base font-bold">Change this booking</h2>
          <p className="mt-1 text-sm text-muted">
            Cancel online or ask the salon to move the appointment to a new slot.
          </p>
          <div className="mt-4 flex flex-wrap items-start gap-3">
            <CancelBookingButton bookingId={booking.id} />
            <RescheduleRequestForm bookingId={booking.id} />
          </div>
          <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
            Online cancellation is limited to the hours before your appointment. Reschedule
            requests are confirmed by the salon before the booking moves.
            {salon.phone ? ` Prefer to talk? Call us at ${salon.phone}.` : ""}
          </p>
        </div>
      )}

      {/* Review: only after completion, one review per booking */}
      {isCompleted && (
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Star className="h-5 w-5 text-rose-gold" />
            Share your experience
          </h2>
          {existingReview ? (
            <div className="mt-3 rounded-xl bg-pastel-pink p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold">
                    Thanks for your review!
                  </p>
                </div>
                <Badge tone={existingReview.isApproved ? "charcoal" : "outline"}>
                  {existingReview.isApproved ? "Published" : "Pending review by the salon"}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-0.5 text-rose-gold" aria-label={`${existingReview.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < existingReview.rating ? "fill-rose-gold" : "fill-charcoal/10 text-charcoal/10"}`}
                  />
                ))}
              </div>
              {existingReview.comment && (
                <p className="mt-2 text-sm leading-relaxed">&ldquo;{existingReview.comment}&rdquo;</p>
              )}
              <p className="mt-2 text-[0.7rem] text-muted">
                {existingReview.isApproved
                  ? "Your review is live on our website."
                  : "Your review has been sent to the salon and will appear on the website once approved."}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-4 text-sm text-muted">
                How was your visit? Your review helps others choose us.
              </p>
              <ReviewForm bookingId={booking.id} />
            </div>
          )}
        </div>
      )}

      {/* Cancelled / no-show friendly note */}
      {booking.status === "CANCELLED" && (
        <div className="card p-6">
          <h2 className="text-base font-bold">This booking was cancelled</h2>
          <p className="mt-1 text-sm text-muted">
            Want to visit us again? Book a new appointment any time.
          </p>
          <Link href="/booking" className="btn-primary mt-4 inline-flex">
            Book again
          </Link>
        </div>
      )}

      {!canManage && !isCompleted && booking.status !== "CANCELLED" && (
        <div className="card p-6">
          <h2 className="text-base font-bold">Need to change?</h2>
          <p className="mt-1 text-sm text-muted">
            {salon.phone
              ? `Online management is no longer available for this booking. Please contact us at ${salon.phone}.`
              : "Online management is no longer available for this booking. Please contact us through the Contact page."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-outline">Contact salon</Link>
            <Link href="/customer/bookings" className="btn-ghost">All bookings</Link>
          </div>
        </div>
      )}
    </div>
  );
}
