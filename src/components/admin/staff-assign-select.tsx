"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

export type StaffOption = { id: string; name: string };

/** Inline specialist picker for a booking row — assign in one click. */
export function StaffAssignSelect({
  bookingId,
  value,
  staff,
}: {
  bookingId: string;
  value: string | null;
  staff: StaffOption[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function assign(staffId: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not assign.");
      setBusy(false);
    }
  }

  return (
    <div className="relative flex w-full items-center gap-1.5">
      {busy && <Loader2 className="absolute right-2 h-3.5 w-3.5 animate-spin text-muted" />}
      <UserPlus className="h-3.5 w-3.5 shrink-0 text-rose-gold" />
      <select
        value={value ?? ""}
        disabled={busy}
        onChange={(e) => assign(e.target.value)}
        className="w-full min-w-0 flex-1 rounded-lg border border-charcoal/15 bg-white px-2 py-1.5 text-xs font-medium text-charcoal transition hover:border-rose-gold focus:border-rose-gold focus:outline-none disabled:opacity-50"
      >
        <option value="">Assign staff…</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {error && <span className="text-[0.65rem] font-medium text-rose-600">{error}</span>}
    </div>
  );
}
