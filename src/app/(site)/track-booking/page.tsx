import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MessageCircle, PackageSearch, Search, Sparkles, User } from "lucide-react";
import { findBookingsByIdentifier, type BookingLookupItem } from "@/lib/booking-lookup";
import { getWhatsAppDigits } from "@/lib/data";
import { formatMoney } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Track Booking",
  description:
    "Check the status of your Meera's - The Beauty Saga appointment with your booking ID or phone number — no login needed.",
};

type Banner = {
  tone: string;
  icon: "pending" | "accepted" | "cancelled" | "info";
  message: string;
};

function bannerFor(status: string): Banner {
  switch (status) {
    case "PENDING":
      return {
        tone: "border-amber-300 bg-amber-50 text-amber-800",
        icon: "pending",
        message: "Waiting for salon confirmation",
      };
    case "CONFIRMED":
      return {
        tone: "border-emerald-300 bg-emerald-50 text-emerald-800",
        icon: "accepted",
        message: "✓ Your booking has been Accepted!",
      };
    case "CHECKED_IN":
    case "IN_PROGRESS":
      return {
        tone: "border-emerald-300 bg-emerald-50 text-emerald-800",
        icon: "accepted",
        message: "You're checked in — enjoy your visit!",
      };
    case "COMPLETED":
      return {
        tone: "border-emerald-300 bg-emerald-50 text-emerald-800",
        icon: "accepted",
        message: "✓ Visit completed — thank you for choosing Meera's!",
      };
    case "CANCELLED":
      return {
        tone: "border-rose-300 bg-rose-50 text-rose-700",
        icon: "cancelled",
        message: "Booking Cancelled",
      };
    case "NO_SHOW":
      return {
        tone: "border-charcoal/20 bg-charcoal/5 text-muted",
        icon: "cancelled",
        message: "Marked as no-show — book again anytime.",
      };
    default: // RESCHEDULED and anything new
      return {
        tone: "border-sky-300 bg-sky-50 text-sky-800",
        icon: "info",
        message: "Rescheduled — please check the new date & time below.",
      };
  }
}

function BannerIcon({ kind }: { kind: Banner["icon"] }) {
  if (kind === "accepted") return <Sparkles className="h-4 w-4 shrink-0" />;
  if (kind === "cancelled") return <PackageSearch className="h-4 w-4 shrink-0" />;
  return <Clock className="h-4 w-4 shrink-0" />;
}

function TrackingCard({
  booking,
  whatsappDigits,
}: {
  booking: BookingLookupItem;
  whatsappDigits: string | null;
}) {
  const start = new Date(booking.startsAt);
  const date = start.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const banner = bannerFor(booking.status);

  const waText = encodeURIComponent(
    `Hello Meera's - The Beauty Saga! I'd like to ask about my booking ${booking.bookingNumber} (${booking.service} on ${date} at ${time}).`,
  );
  const waHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${waText}`
    : "https://wa.me/";

  return (
    <div className="card overflow-hidden">
      {/* Status banner */}
      <div className={`flex items-center gap-2 border-b px-5 py-3.5 text-sm font-bold ${banner.tone}`}>
        <BannerIcon kind={banner.icon} />
        {banner.message}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold">{booking.service}</p>
            <p className="mt-1 font-mono text-xs text-muted">Booking ID · {booking.bookingNumber}</p>
          </div>
          <span className="rounded-full bg-pastel-pink px-4 py-1.5 text-sm font-bold text-rose-gold-dark">
            {formatMoney(booking.totalCents)}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-pastel-pink px-3.5 py-3">
            <Calendar className="h-4 w-4 shrink-0 text-rose-gold" />
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Date</dt>
              <dd className="font-semibold">{date}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-pastel-pink px-3.5 py-3">
            <Clock className="h-4 w-4 shrink-0 text-rose-gold" />
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Time</dt>
              <dd className="font-semibold">{time}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <User className="h-4 w-4 text-rose-gold" />
            Specialist:{" "}
            <span className="font-semibold text-charcoal">
              {booking.staffName ?? "To be assigned"}
            </span>
          </span>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function TrackBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const whatsappDigits = await getWhatsAppDigits();

  let results: BookingLookupItem[] | null = null;
  let error: string | null = null;

  if (query) {
    const digits = query.replace(/\D/g, "");
    const looksLikeEmail = query.includes("@") && query.includes(".");
    const looksLikeBookingNumber = /^mb/i.test(query);
    if (!looksLikeBookingNumber && !looksLikeEmail && digits.length < 8) {
      error = "Please enter a booking ID (e.g. MB-XXXX) or your phone number.";
    } else {
      try {
        results = await findBookingsByIdentifier(query, 20);
      } catch {
        error = "Something went wrong while searching. Please try again.";
        results = null;
      }
    }
  }

  const waMessage = encodeURIComponent(
    "Hello Meera's - The Beauty Saga! I'd like help tracking my booking.",
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="pattern-surface relative overflow-hidden py-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-rose-gold/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-rose-gold/10"
        />
        <div className="container-site relative z-10 text-center">
          <span className="eyebrow justify-center">No login needed</span>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">Track Your Booking</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Enter your booking ID or the phone number you booked with, and see instantly whether the
            salon has confirmed your appointment.
          </p>

          {/* Luxury search box */}
          <Reveal className="mx-auto mt-9 max-w-2xl">
            <form
              action="/track-booking"
              className="flex flex-col gap-3 rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-lift backdrop-blur-md sm:flex-row sm:rounded-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Booking ID (MB-…) or phone number"
                  className="field-input !border-transparent !bg-transparent !rounded-full !py-3.5 !pl-11 !text-base focus:!ring-0"
                  aria-label="Booking ID or phone number"
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn-primary !rounded-full !py-3.5 sm:!px-9">
                <Search className="h-4 w-4" />
                Track Booking
              </button>
            </form>
            {error && (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          {results !== null ? (
            results.length > 0 ? (
              <div className="space-y-5">
                <p className="text-center text-sm text-muted">
                  Found {results.length === 1 ? "1 booking" : `${results.length} bookings`} — newest
                  first.
                </p>
                {results.map((b) => (
                  <Reveal key={b.id}>
                    <TrackingCard booking={b} whatsappDigits={whatsappDigits} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-[2rem] border border-charcoal/10 bg-cream p-10 text-center shadow-soft">
                <PackageSearch className="mx-auto h-10 w-10 text-rose-gold" />
                <p className="mt-4 text-lg font-bold">No bookings found</p>
                <p className="mt-2 text-sm text-muted">
                  We couldn&rsquo;t find a booking for{" "}
                  <span className="font-semibold text-charcoal">&ldquo;{query}&rdquo;</span>. Please
                  double-check your booking ID or phone number — or chat with us and we&rsquo;ll find
                  it for you.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {whatsappDigits && (
                    <a
                      href={`https://wa.me/${whatsappDigits}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  )}
                  <Link href="/booking" className="btn-outline">
                    Book New Appointment
                  </Link>
                </div>
              </div>
            )
          ) : (
            !error && (
              <div className="mx-auto max-w-2xl text-center">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { step: "1", text: "Enter your booking ID or phone number" },
                    { step: "2", text: "See your live booking status instantly" },
                    { step: "3", text: "Chat on WhatsApp if anything needs changing" },
                  ].map((s) => (
                    <Reveal key={s.step}>
                      <div className="card h-full p-6">
                        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-gold font-heading text-base font-bold text-white">
                          {s.step}
                        </span>
                        <p className="mt-3 text-sm font-semibold leading-relaxed">{s.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
