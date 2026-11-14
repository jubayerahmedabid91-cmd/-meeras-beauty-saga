import type { Metadata } from "next";
import { StaffForm } from "@/components/admin/staff-form";

export const metadata: Metadata = { title: "Add Staff" };

export default function AdminNewStaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Add Staff</h1>
        <p className="mt-1 text-sm text-muted">Create a new staff account.</p>
      </div>
      <div className="card p-6">
        <StaffForm />
      </div>
    </div>
  );
}
