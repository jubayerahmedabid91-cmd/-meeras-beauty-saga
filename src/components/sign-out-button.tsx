"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton({
  variant = "sidebar",
  className = "",
}: {
  variant?: "sidebar" | "topbar";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
      aria-label="Sign out"
      className={
        variant === "sidebar"
          ? "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition hover:bg-rose-50 hover:text-rose-700"
          : "btn-ghost !px-3 !py-2 text-xs"
      }
    >
      <LogOut className="h-4 w-4" />
      {variant === "sidebar" && "Sign out"}
      {variant === "topbar" && <span className="sr-only">Sign out</span>}
      {className}
    </button>
  );
}
