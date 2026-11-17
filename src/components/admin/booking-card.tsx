"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { BookingRowActions } from "./booking-row-actions";
import type { BookingActionData } from "./booking-actions";
import { StaffAssignSelect } from "./staff-assign-select";

export type BookingCardData = BookingActionData & {
  staffId: string | null;
};

/**
 * Mobile-first booking card: everything a salon owner needs on one thumb-reach —
 * client, service, date/time, price, status, inline staff picker and the
 * one-click Accept / Cancel / WhatsApp / Receipt actions.
 */
export function BookingCard({
  booking,
  staff,
}: {
  booking: BookingCardData;
  staff: { id: string; name: string }[];
}) {
  return (
    <div className="card p-4">
      {/* Top: client + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold">{booking.customerName}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {booking.service} · <span className="font-mono">{booking.bookingNumber}</span>
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Date / time / price row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-pastel-pink px-3 py-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Calendar className="h-3.5 w-3.5 text-rose-gold" />
          {booking.date}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Clock className="h-3.5 w-3.5 text-rose-gold" />
          {booking.time}
        </span>
        <span className="ml-auto text-sm font-bold text-rose-gold-dark">
          {formatMoney(booking.totalCents)}
        </span>
      </div>

      {/* Staff assignment */}
      <div className="mt-3">
        <StaffAssignSelect bookingId={booking.id} value={booking.staffId} staff={staff} />
      </div>

      {/* One-click actions */}
      <div className="mt-3 border-t border-charcoal/5 pt-3">
        <BookingRowActions booking={booking} variant="card" />
      </div>

      {/* Full details */}
      <Link
        href={`/admin/bookings/${booking.id}`}
        className="mt-3 block text-center text-xs font-semibold text-rose-gold hover:underline"
      >
        View full details →
      </Link>
    </div>
  );
}
