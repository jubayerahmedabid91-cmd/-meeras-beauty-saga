"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingActions, type BookingActionData } from "./booking-actions";

/**
 * One-click row actions: accept / cancel a pending booking without leaving the
 * table, plus the WhatsApp confirmation and printable receipt.
 *
 * `variant="card"` renders thumb-friendly, equal-width buttons for the mobile
 * booking cards; the default is compact right-aligned buttons for table rows.
 */
export function BookingRowActions({
  booking,
  variant = "row",
}: {
  booking: BookingActionData;
  variant?: "row" | "card";
}) {
  const isCard = variant === "card";
  const baseBtn = isCard
    ? "flex flex-1 items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
    : "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50";
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "cancel" | null>(null);
  const [error, setError] = useState("");

  async function setStatus(status: "CONFIRMED" | "CANCELLED") {
    const mode = status === "CONFIRMED" ? "accept" : "cancel";
    setBusy(mode);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not update this booking.");
      setBusy(null);
    }
  }

  return (
    <div className={cn(isCard ? "flex flex-col gap-2" : "flex flex-wrap items-center justify-end gap-1.5")}>
      {booking.status === "PENDING" && (
        <>
          <button
            type="button"
            onClick={() => setStatus("CONFIRMED")}
            disabled={busy !== null}
            className={cn(baseBtn, "bg-emerald-600 hover:bg-emerald-700")}
          >
            {busy === "accept" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accept
          </button>
          <button
            type="button"
            onClick={() => setStatus("CANCELLED")}
            disabled={busy !== null}
            className={cn(baseBtn, "bg-rose-600 hover:bg-rose-700")}
          >
            {busy === "cancel" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Cancel
          </button>
        </>
      )}
      <BookingActions booking={booking} variant={variant} />
      {error && (
        <span className={cn("text-[0.65rem] font-medium text-rose-600", isCard ? "text-left" : "w-full text-right")}>
          {error}
        </span>
      )}
    </div>
  );
}
