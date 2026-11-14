import type { Metadata } from "next";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const metadata: Metadata = { title: "Change Password" };

export default async function AdminChangePasswordPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Change Password</h1>
        <p className="mt-1 text-sm text-muted">
          Update your admin password. You will be signed out on other devices after changing your password.
        </p>
      </div>

      <div className="card p-6">
        <PasswordChangeForm sessionId={session?.user?.id ?? ""} />
      </div>
    </div>
  );
}

function PasswordChangeForm({ sessionId }: { sessionId: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      setStatus("idle");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to change password.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Sign out all other sessions after password change
      try {
        await fetch("/api/admin/sign-out-all", { method: "POST" });
      } catch {
        // Ignore
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="field-label">Current password</label>
        <div className="relative">
          <input
            type="password"
            className="field-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="field-label">New password</label>
        <div className="relative">
          <input
            type="password"
            className="field-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="field-label">Confirm new password</label>
        <div className="relative">
          <input
            type="password"
            className="field-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
            minLength={8}
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        </div>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle className="h-4 w-4" />
          Password changed successfully. You will be signed out on all devices.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Changing...
            </>
          ) : (
            "Change password"
          )}
        </button>
        <Link href="/admin" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
