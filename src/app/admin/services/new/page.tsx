import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "Add Service" };

export default function AdminNewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Add Service</h1>
        <p className="mt-1 text-sm text-muted">Create a new service for your menu.</p>
      </div>
      <div className="card p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
