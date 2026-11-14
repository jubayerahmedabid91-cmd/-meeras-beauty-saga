import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoWordmark } from "@/components/logo";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = { title: "Admin Panel" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as { role?: string }).role;
  if (!["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"].includes(role ?? "")) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar role={role ?? "RECEPTIONIST"} />
      <div className="flex-1 min-h-screen">
        <AdminHeader />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
