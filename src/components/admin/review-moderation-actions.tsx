"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Approve / unapprove buttons for a client review.
 *
 * Approve creates (or refreshes) a public Testimonial with source = "OWNER".
 * Unapprove hides it again. Seeded sample testimonials are never affected.
 */
export function ReviewModerationActions({
  reviewId,
  isApproved,
  canModerate,
}: {
  reviewId: string;
  isApproved: boolean;
  canModerate: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function setApproval(action: "approve" | "unapprove") {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not update this review.");
        setBusy(false);
        return;
      }
      router.refresh();
      setBusy(false);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  if (!canModerate) {
    return (
      <p className="text-[0.7rem] font-medium text-muted">
        Only the owner can moderate reviews.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {isApproved ? (
        <button
          type="button"
          onClick={() => setApproval("unapprove")}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-lg border border-charcoal/15 px-2.5 py-1.5 text-xs font-semibold text-charcoal transition hover:border-rose-gold hover:text-rose-gold disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
          Hide from site
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setApproval("approve")}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve &amp; publish
        </button>
      )}
      {error && (
        <p className={cn("w-full text-right text-[0.65rem] font-medium text-rose-600")}>
          {error}
        </p>
      )}
    </div>
  );
}
