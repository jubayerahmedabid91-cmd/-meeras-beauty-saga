"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function StaffForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    password: "",
    commissionRate: 0,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
      router.push("/admin/staff");
    } catch {
      setStatus("error");
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Email</label>
          <input type="email" className="field-input" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Phone</label>
          <input className="field-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Job title</label>
          <input className="field-input" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Commission rate (%)</label>
          <input type="number" min={0} max={100} step={0.5} className="field-input" value={form.commissionRate} onChange={(e) => update("commissionRate", Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="field-label">Temporary password</label>
        <input type="password" minLength={8} className="field-input" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        <p className="mt-1 text-xs text-muted">Staff member should change this after first login.</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create staff account"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Created
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">Could not create.</span>
        )}
      </div>
    </form>
  );
}
