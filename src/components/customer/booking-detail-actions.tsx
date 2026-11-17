"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Star,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Cancel booking (two-step confirm) ─────────────────────────────────── */

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/customer/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not cancel this booking.");
        setBusy(false);
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Booking cancelled.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
      >
        <Ban className="h-4 w-4" />
        Cancel booking
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm font-semibold text-rose-800">
        Cancel this booking?
      </p>
      <p className="text-xs text-rose-700">
        This cannot be undone. Online cancellation closes when the salon&rsquo;s
        cancellation window begins.
      </p>
      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={cancel}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
          Yes, cancel it
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="rounded-lg border border-charcoal/15 bg-white px-4 py-2 text-xs font-semibold text-charcoal transition hover:bg-charcoal/5"
        >
          Keep my booking
        </button>
      </div>
      {error && <p className="text-xs font-medium text-rose-700">{error}</p>}
    </div>
  );
}

/* ── Request reschedule ────────────────────────────────────────────────── */

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export function RescheduleRequestForm({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!preferredDate) {
      setError("Please pick your preferred date.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/customer/bookings/${bookingId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredDate,
          preferredTime: preferredTime || undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not send your request. Please try again.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className="inline-flex items-start gap-2 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        Request sent. Our team will confirm the new slot with you — your current
        appointment stays valid until then.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-charcoal/15 bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:border-rose-gold hover:text-rose-gold"
      >
        <CalendarClock className="h-4 w-4" />
        Request new date &amp; time
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="w-full space-y-3 rounded-xl bg-pastel-pink p-4">
      <p className="text-sm font-semibold">Request a new slot</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred-date" className="field-label">
            Preferred date
          </label>
          <input
            id="preferred-date"
            type="date"
            min={minDate}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="field-input"
            required
          />
        </div>
        <div>
          <label htmlFor="preferred-time" className="field-label">
            Preferred time (optional)
          </label>
          <select
            id="preferred-time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="field-input"
          >
            <option value="">Any time</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="reschedule-note" className="field-label">
          Note for the salon (optional)
        </label>
        <textarea
          id="reschedule-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field-input resize-none"
          placeholder="Anything we should know?"
          maxLength={500}
        />
      </div>
      {error && <p className="text-xs font-medium text-rose-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-gold px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-gold-dark disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send request
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={busy}
          className="rounded-lg border border-charcoal/15 bg-white px-4 py-2 text-xs font-semibold text-charcoal transition hover:bg-charcoal/5"
        >
          Close
        </button>
      </div>
    </form>
  );
}

/* ── Leave a review (completed bookings only) ──────────────────────────── */

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment: comment.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not submit your review. Please try again.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <span className="field-label">Your rating</span>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= (hovered || rating);
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onFocus={() => setHovered(value)}
                onBlur={() => setHovered(0)}
                onClick={() => setRating(value)}
                className="rounded-md p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-gold/40"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    active ? "fill-rose-gold text-rose-gold" : "fill-charcoal/10 text-charcoal/10",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="review-comment" className="field-label">
          Your experience (optional)
        </label>
        <textarea
          id="review-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          className="field-input resize-none"
          placeholder="What did you like? How did it feel?"
        />
      </div>
      {error && <p className="text-xs font-medium text-rose-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl bg-rose-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-gold-dark disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
        Submit review
      </button>
      <p className="text-[0.7rem] leading-relaxed text-muted">
        Reviews are checked by the salon before they appear on the website.
      </p>
    </form>
  );
}
