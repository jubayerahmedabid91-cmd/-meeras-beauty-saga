"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export const STAFF_ROLES = ["STAFF", "RECEPTIONIST", "MANAGER", "ADMIN", "OWNER"] as const;

type Props = {
  mode?: "create" | "edit";
  staffId?: string;
  initial?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    role: string;
    commissionRate: number;
    isActive: boolean;
  };
};

export function StaffForm({ mode = "create", staffId, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    jobTitle: initial?.jobTitle ?? "",
    role: initial?.role ?? "STAFF",
    password: "",
    commissionRate: initial?.commissionRate ?? 0,
    isActive: initial?.isActive ?? true,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function update(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const url = mode === "edit" && staffId ? `/api/admin/staff?id=${staffId}` : "/api/admin/staff";
    const payload = mode === "edit" ? { ...form, password: form.password || undefined } : form;

    try {
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save the staff account.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      router.refresh();
      router.push("/admin/staff");
    } catch {
      setError("Network error. Please try again.");
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Role</label>
          <select className="field-input" value={form.role} onChange={(e) => update("role", e.target.value)}>
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Controls which admin sections this account can access.</p>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="field-input" value={form.isActive ? "active" : "inactive"} onChange={(e) => update("isActive", e.target.value === "active")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">
          {mode === "edit" ? "Reset password (leave blank to keep current)" : "Temporary password"}
        </label>
        <input
          type="password"
          minLength={mode === "edit" ? undefined : 8}
          className="field-input"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required={mode === "create"}
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-muted">
          {mode === "edit"
            ? "Only fill this in if you want to set a new password for this account."
            : "Staff member should change this after first login."}
        </p>
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
              Saving...
            </>
          ) : mode === "edit" ? (
            "Save changes"
          ) : (
            "Create staff account"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
