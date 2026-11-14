"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function ProfileForm({ initial }: { initial: Record<string, string> }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">First name</label>
          <input className="field-input" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Last name</label>
          <input className="field-input" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="field-label">Phone</label>
        <input className="field-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Date of birth</label>
          <input type="date" className="field-input" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Gender</label>
          <select className="field-input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="field-label">Address</label>
        <input className="field-input" value={form.address} onChange={(e) => update("address", e.target.value)} />
      </div>
      <div>
        <label className="field-label">City</label>
        <input className="field-input" value={form.city} onChange={(e) => update("city", e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">Could not save. Try again.</span>
        )}
      </div>
    </form>
  );
}
