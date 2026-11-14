"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Could not create your account.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login?registered=1");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-500" />
        <h2 className="text-lg font-bold">Account created</h2>
        <p className="text-sm text-muted">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="field-label">First name</label>
          <input id="firstName" name="firstName" required className="field-input" placeholder="First name" />
        </div>
        <div>
          <label htmlFor="lastName" className="field-label">Last name</label>
          <input id="lastName" name="lastName" required className="field-input" placeholder="Last name" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field-input" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">Phone</label>
        <input id="phone" name="phone" type="tel" className="field-input" placeholder="Your phone number" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="field-input" placeholder="Minimum 8 characters" />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-xs text-muted">
        By creating an account you agree to our Terms &amp; Conditions and Privacy Policy.
      </p>
    </form>
  );
}
