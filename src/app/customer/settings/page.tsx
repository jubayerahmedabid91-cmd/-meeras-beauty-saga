import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "@/components/customer/change-password-form";

export const metadata: Metadata = { title: "Account Settings" };

export default async function CustomerSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });
  if (!customer) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account security and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-bold">Change password</h2>
          <p className="mt-1 text-sm text-muted">Keep your account secure with a strong password.</p>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold">Account information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Email</dt>
              <dd className="font-semibold">{session.user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Phone</dt>
              <dd className="font-semibold">{customer.user.phone ?? "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Member since</dt>
              <dd className="font-semibold">{new Date(customer.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Referral code</dt>
              <dd className="font-semibold">{customer.referralCode || "Not set"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
