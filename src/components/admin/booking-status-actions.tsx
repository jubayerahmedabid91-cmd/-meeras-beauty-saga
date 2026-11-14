"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

const ACTIONS: { status: string; label: string; tone: string }[] = [
  { status: "CONFIRMED", label: "Confirm", tone: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { status: "CHECKED_IN", label: "Check in", tone: "bg-sky-500 text-white hover:bg-sky-600" },
  { status: "IN_PROGRESS", label: "Start service", tone: "bg-violet-500 text-white hover:bg-violet-600" },
  { status: "COMPLETED", label: "Complete", tone: "bg-emerald-600 text-white hover:bg-emerald-700" },
  { status: "CANCELLED", label: "Cancel", tone: "bg-rose-500 text-white hover:bg-rose-600" },
  { status: "NO_SHOW", label: "Mark no-show", tone: "bg-slate-500 text-white hover:bg-slate-600" },
];

export function BookingStatusActions({ bookingId, status }: { bookingId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function update(nextStatus: string) {
    setLoading(nextStatus);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold">Update status</h2>
      {done && (
        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600">
          <Check className="h-4 w-4" />
          Status updated
        </p>
      )}
      <div className="mt-4 grid gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.status}
            onClick={() => update(a.status)}
            disabled={loading !== null || status === a.status}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${a.tone}`}
          >
            {loading === a.status ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              a.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
