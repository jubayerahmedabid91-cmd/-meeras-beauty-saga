"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function LeaveRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/staff/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setForm({ startDate: "", endDate: "", reason: "" });
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Start date</label>
          <input
            type="date"
            required
            className="field-input"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">End date</label>
          <input
            type="date"
            required
            className="field-input"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="field-label">Reason</label>
        <textarea
          rows={2}
          className="field-input resize-none"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="Optional"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit request"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Submitted
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">Could not submit. Try again.</span>
        )}
      </div>
    </form>
  );
}
