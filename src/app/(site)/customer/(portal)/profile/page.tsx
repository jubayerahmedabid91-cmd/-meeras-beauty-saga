import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/customer/profile-form";

export const metadata: Metadata = { title: "Profile" };

export default async function CustomerProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: { user: true, memberships: { include: { membership: true } } },
  });
  if (!customer) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-muted">Manage your personal details and contact information.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pastel-pink text-2xl font-bold text-rose-gold">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <h2 className="mt-4 text-lg font-bold">{customer.firstName} {customer.lastName}</h2>
          <p className="text-sm text-muted">{customer.user.email}</p>
          {customer.memberships[0] && (
            <span className="mt-3 inline-block rounded-full bg-rose-gold/10 px-3 py-1 text-xs font-semibold text-rose-gold">
              {customer.memberships[0].membership.name} member
            </span>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Personal details</h2>
          <div className="mt-4">
            <ProfileForm
              initial={{
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.user.phone ?? "",
                dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.toISOString().slice(0, 10) : "",
                gender: customer.gender ?? "",
                address: customer.address ?? "",
                city: customer.city ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
