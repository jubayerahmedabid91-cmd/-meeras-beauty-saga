"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export function CouponRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not update.");
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this coupon? Customers will no longer be able to use it.")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not delete.");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-flex gap-1.5">
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className={
            "rounded-lg border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 " +
            (isActive
              ? "border-amber-500/40 text-amber-700 hover:bg-amber-50"
              : "border-emerald-600/30 text-emerald-700 hover:bg-emerald-50")
          }
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-600/30 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </span>
      {error && <span className="text-[0.65rem] font-medium text-rose-600">{error}</span>}
    </span>
  );
}
