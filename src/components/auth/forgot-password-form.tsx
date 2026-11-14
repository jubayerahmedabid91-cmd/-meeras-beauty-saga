"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Mail className="h-12 w-12 text-emerald-500" />
        <h2 className="text-lg font-bold">Check your inbox</h2>
        <p className="text-sm text-muted">
          If an account exists for <span className="font-semibold">{email}</span>, a reset link has
          been sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input
          id="email"
          type="email"
          required
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          Could not send reset link. Please try again.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </button>
    </form>
  );
}
