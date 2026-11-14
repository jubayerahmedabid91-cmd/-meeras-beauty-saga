"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteStaffButton({ staffId, name }: { staffId: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!window.confirm(`Delete ${name}? This removes their login access. This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/staff?id=${staffId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className="inline-flex items-center gap-1 rounded-lg border border-rose-600/30 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        Delete
      </button>
      {error && <span className="text-[0.65rem] font-medium text-rose-600">{error}</span>}
    </span>
  );
}
