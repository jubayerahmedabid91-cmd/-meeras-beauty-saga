import type { Metadata } from "next";
import { PackageForm } from "@/components/admin/package-form";

export const metadata: Metadata = { title: "Add Package" };

export default function AdminNewPackagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Add Package</h1>
        <p className="mt-1 text-sm text-muted">Create a new package bundle.</p>
      </div>
      <div className="card p-6">
        <PackageForm />
      </div>
    </div>
  );
}
