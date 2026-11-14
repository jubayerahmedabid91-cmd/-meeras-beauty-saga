import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "rose",
  className,
}: {
  children: ReactNode;
  tone?: "rose" | "charcoal" | "outline";
  className?: string;
}) {
  const tones = {
    rose: "bg-rose-gold/10 text-rose-gold",
    charcoal: "bg-charcoal/5 text-charcoal",
    outline: "border border-charcoal/15 text-charcoal",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-800" },
    CONFIRMED: { label: "Confirmed", cls: "bg-sky-100 text-sky-800" },
    CHECKED_IN: { label: "Checked In", cls: "bg-indigo-100 text-indigo-800" },
    IN_PROGRESS: { label: "In Progress", cls: "bg-violet-100 text-violet-800" },
    COMPLETED: { label: "Completed", cls: "bg-emerald-100 text-emerald-800" },
    CANCELLED: { label: "Cancelled", cls: "bg-rose-100 text-rose-700" },
    RESCHEDULED: { label: "Rescheduled", cls: "bg-orange-100 text-orange-800" },
    NO_SHOW: { label: "No Show", cls: "bg-slate-200 text-slate-700" },
  };
  const s = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-700" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", s.cls)}>
      {s.label}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark" | "ghost";
  className?: string;
}) {
  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
    dark: "btn-dark",
    ghost: "btn-ghost",
  } as const;
  return (
    <Link href={href} className={cn(variants[variant], className)}>
      {children}
    </Link>
  );
}
