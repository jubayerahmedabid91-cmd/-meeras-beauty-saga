"use client";

import { useState } from "react";
import { MessageCircle, Printer, ReceiptText, X } from "lucide-react";
import { formatMoney } from "@/lib/utils";

export type BookingActionData = {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string | null;
  service: string;
  date: string;
  time: string;
  totalCents: number;
  discountCents?: number;
  couponCode?: string | null;
  status: string;
  staffName: string | null;
  notes: string | null;
};

function digits(value: string | null): string {
  return (value ?? "").replace(/[^\d]/g, "");
}

export function BookingActions({ booking }: { booking: BookingActionData }) {
  const [open, setOpen] = useState(false);

  const phone = digits(booking.customerPhone);
  const message = encodeURIComponent(
    `Hello ${booking.customerName},\n\n` +
      `This is Meera's - The Beauty Saga. Your appointment is confirmed.\n\n` +
      `Booking ref: ${booking.bookingNumber}\n` +
      `Service: ${booking.service}\n` +
      `Date: ${booking.date}\n` +
      `Time: ${booking.time}\n` +
      (booking.staffName ? `Specialist: ${booking.staffName}\n` : "") +
      `Amount: ${formatMoney(booking.totalCents)}\n\n` +
      `We look forward to welcoming you. For any changes, simply reply here.`,
  );

  const waLink =
    phone.length >= 8
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        {booking.status !== "CANCELLED" && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Send confirmation on WhatsApp"
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-600/30 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Printable receipt"
          className="inline-flex items-center gap-1 rounded-lg border border-charcoal/15 px-2.5 py-1 text-xs font-semibold text-charcoal transition hover:border-rose-gold hover:text-rose-gold"
        >
          <ReceiptText className="h-3.5 w-3.5" />
          Receipt
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
              <h3 className="text-lg font-bold">Receipt</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close receipt"
                className="rounded-lg p-2 text-muted transition hover:bg-pastel-pink hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div id="print-area" className="px-6 py-6 text-sm">
              <div className="text-center">
                <p className="text-xl font-bold tracking-tight">
                  Meera&rsquo;s <span className="font-light text-rose-gold">THE BEAUTY SAGA</span>
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                  Premium Beauty Salon
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-pastel-pink px-4 py-3 text-xs">
                <span className="font-semibold text-muted">Booking ref</span>
                <span className="font-mono font-bold text-charcoal">{booking.bookingNumber}</span>
              </div>

              <dl className="mt-5 space-y-3">
                <Row label="Client" value={booking.customerName} />
                <Row label="Service" value={booking.service} />
                <Row label="Date" value={booking.date} />
                <Row label="Time" value={booking.time} />
                {booking.staffName && <Row label="Specialist" value={booking.staffName} />}
                <Row label="Status" value={booking.status.replace("_", " ")} />
                {booking.notes && <Row label="Notes" value={booking.notes} />}
              </dl>

              {(booking.discountCents ?? 0) > 0 && (
                <div className="mt-4 space-y-1.5 rounded-xl bg-pastel-pink p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatMoney(booking.totalCents + (booking.discountCents ?? 0))}</span>
                  </div>
                  <div className="flex justify-between font-medium text-emerald-700">
                    <span>
                      Discount
                      {booking.couponCode ? (
                        <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase text-emerald-800">
                          {booking.couponCode}
                        </span>
                      ) : null}
                    </span>
                    <span>-{formatMoney(booking.discountCents ?? 0)}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-4">
                <span className="text-sm font-semibold text-muted">Total</span>
                <span className="text-xl font-bold text-rose-gold">
                  {formatMoney(booking.totalCents)}
                </span>
              </div>

              <p className="mt-6 text-center text-[0.65rem] leading-relaxed text-muted">
                Thank you for choosing Meera&rsquo;s &ndash; The Beauty Saga.
                <br />
                Final pricing is confirmed during consultation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-charcoal/10 px-6 py-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary flex-1 justify-center"
              >
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-right font-semibold text-charcoal">{value}</dd>
    </div>
  );
}
