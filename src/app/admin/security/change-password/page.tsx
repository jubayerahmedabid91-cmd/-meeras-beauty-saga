import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata: Metadata = { title: "Change Password" };

export default async function AdminChangePasswordPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as { role?: string }).role;
  if (!["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"].includes(role ?? "")) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Change Password</h1>
        <p className="mt-1 text-sm text-muted">
          Update your admin password. Use a strong, unique password you do not reuse elsewhere.
        </p>
      </div>

      <div className="card max-w-xl p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}

