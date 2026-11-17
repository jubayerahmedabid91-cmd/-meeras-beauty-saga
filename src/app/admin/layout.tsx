import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { CurrencyProvider } from "@/components/currency-provider";
import { getSalonProfile } from "@/lib/salon";

export const metadata: Metadata = { title: "Admin Panel" };

/**
 * Admin shell — a dedicated, mobile-first layout.
 *
 * The storefront header/footer live in the `(site)` route group, so nothing
 * here is duplicated: just one top bar (mobile), the dark sidebar (desktop),
 * and a sticky bottom tab bar for one-thumb navigation.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await safeAuth();
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as { role?: string }).role;
  if (!["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"].includes(role ?? "")) redirect("/auth/login");

  const salon = await getSalonProfile();

  return (
    <CurrencyProvider currency={salon.currency}>
      <AdminShell logoUrl={salon.logoUrl}>{children}</AdminShell>
    </CurrencyProvider>
  );
}
