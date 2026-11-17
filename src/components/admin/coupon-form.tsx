"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function CouponForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "PERCENT",
    value: "10",
    minSpendCents: "0",
    maxUses: "",
    startsAt: "",
    endsAt: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const payload: Record<string, unknown> = {
      code: form.code,
      description: form.description || undefined,
      type: form.type,
      value: Number(form.value),
      minSpendCents: Number(form.minSpendCents) || 0,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      startsAt: form.startsAt || undefined,
      endsAt: form.endsAt || undefined,
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not create the coupon.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      router.refresh();
      router.push("/admin/coupons");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Code</label>
          <input
            className="field-input font-mono uppercase"
            value={form.code}
            onChange={(e) => update("code", e.target.value)}
            placeholder="BRIDAL10"
            required
            minLength={3}
            maxLength={30}
          />
          <p className="mt-1 text-xs text-muted">Shown to customers at checkout.</p>
        </div>
        <div>
          <label className="field-label">Description</label>
          <input
            className="field-input"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="10% off bridal packages"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Discount type</label>
          <select
            className="field-input"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="PERCENT">Percentage (%)</option>
            <option value="FIXED">Flat amount (USD)</option>
          </select>
        </div>
        <div>
          <label className="field-label">
            {form.type === "PERCENT" ? "Percent off (1-100)" : "Amount off (USD)"}
          </label>
          <input
            type="number"
            min={1}
            max={form.type === "PERCENT" ? 100 : undefined}
            className="field-input"
            value={form.value}
            onChange={(e) => update("value", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Minimum spend (USD, optional)</label>
          <input
            type="number"
            min={0}
            className="field-input"
            value={form.minSpendCents}
            onChange={(e) => update("minSpendCents", e.target.value)}
          />
          <p className="mt-1 text-xs text-muted">Order subtotal in dollars.</p>
        </div>
        <div>
          <label className="field-label">Max uses (optional)</label>
          <input
            type="number"
            min={1}
            className="field-input"
            value={form.maxUses}
            onChange={(e) => update("maxUses", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Starts (optional)</label>
          <input
            type="date"
            className="field-input"
            value={form.startsAt}
            onChange={(e) => update("startsAt", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Ends (optional)</label>
          <input
            type="date"
            className="field-input"
            value={form.endsAt}
            onChange={(e) => update("endsAt", e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create coupon"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Created
          </span>
        )}
      </div>
    </form>
  );
}
