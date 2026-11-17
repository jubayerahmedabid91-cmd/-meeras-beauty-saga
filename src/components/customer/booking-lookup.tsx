"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Loader2, MessageCircle, Search, Sparkles } from "lucide-react";
import type { BookingLookupItem } from "@/lib/booking-lookup";
import { formatMoney } from "@/lib/utils";
import { fillMessage } from "@/lib/messages";
import { useCurrency } from "@/components/currency-provider";

function statusTone(status: string) {
  if (status === "PENDING") return "bg-amber-100 text-amber-800 border-amber-300";
  if (status === "CANCELLED") return "bg-rose-100 text-rose-700 border-rose-300";
  if (status === "NO_SHOW") return "bg-charcoal/10 text-muted border-charcoal/20";
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Card rendering one looked-up booking. */
export function LookupBookingCard({
  booking,
  whatsappDigits,
  message,
}: {
  booking: BookingLookupItem;
  whatsappDigits: string | null;
  message: string;
}) {
  const currency = useCurrency();
  const money = (cents: number) => formatMoney(cents, currency);
  const start = new Date(booking.startsAt);
  const date = start.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const waText = encodeURIComponent(
    fillMessage(message, {
      name: booking.customerName,
      service: booking.service,
      date,
      time,
      ref: booking.bookingNumber,
    }),
  );

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold">{booking.service}</p>
          <p className="mt-0.5 font-mono text-xs text-muted">{booking.bookingNumber}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${statusTone(booking.status)}`}>
          {statusLabel(booking.status)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-pastel-pink px-3 py-2.5 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-rose-gold" />
          {date}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-rose-gold" />
          {time}
        </span>
        <span className="ml-auto text-sm font-bold text-rose-gold-dark">
          {money(booking.totalCents)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          Specialist:{" "}
          <span className="font-semibold text-charcoal">{booking.staffName ?? "To be assigned"}</span>
        </span>
        {whatsappDigits && (
          <a
            href={`https://wa.me/${whatsappDigits}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Phone / email / booking-ID lookup for visitors who are not signed in.
 */
export function BookingLookup({
  whatsappDigits,
  message,
}: {
  whatsappDigits: string | null;
  message: string;
}) {
  const currency = useCurrency();
  const money = (cents: number) => formatMoney(cents, currency);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<BookingLookupItem[] | null>(null);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter your phone number, email or booking ID.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/customer/bookings/lookup?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not find your bookings.");
        setResults(null);
      } else {
        setResults(data.bookings as BookingLookupItem[]);
        setSearched(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={lookup} className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Phone number, email or booking ID (MB-…)"
            className="field-input !rounded-full !py-3.5 !pl-11"
            aria-label="Look up bookings"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !py-3.5 sm:!px-8"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Find my bookings
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-4 max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      {results !== null && searched && (
        <div className="mt-10">
          {results.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-charcoal/10 bg-white p-8 text-center shadow-soft">
              <Sparkles className="mx-auto h-8 w-8 text-rose-gold" />
              <p className="mt-3 font-bold">No bookings found</p>
              <p className="mt-1 text-sm text-muted">
                Double-check the phone number, email or booking ID you entered — or book your first
                appointment below.
              </p>
              <Link href="/booking" className="btn-primary mt-5">
                Book New Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((b) => (
                <LookupBookingCard key={b.id} booking={b} whatsappDigits={whatsappDigits} message={message} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
