"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function ChangePasswordForm() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      setMessage("New passwords do not match.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/customer/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error ?? "Could not update password.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      setMessage("Password updated.");
      setForm({ current: "", next: "", confirm: "" });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="field-label">Current password</label>
        <input
          type="password"
          required
          className="field-input"
          value={form.current}
          onChange={(e) => setForm({ ...form, current: e.target.value })}
        />
      </div>
      <div>
        <label className="field-label">New password</label>
        <input
          type="password"
          required
          minLength={8}
          className="field-input"
          value={form.next}
          onChange={(e) => setForm({ ...form, next: e.target.value })}
        />
      </div>
      <div>
        <label className="field-label">Confirm new password</label>
        <input
          type="password"
          required
          minLength={8}
          className="field-input"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
      </div>

      {message && (
        <p className={`text-sm font-medium ${status === "saved" ? "text-emerald-600" : "text-rose-600"}`}>
          {status === "saved" && <CheckCircle className="mr-1 inline h-4 w-4" />}
          {message}
        </p>
      )}

      <button type="submit" disabled={status === "saving"} className="btn-primary">
        {status === "saving" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
}
