import type { Metadata } from "next";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Customer Segments" };

export default function AdminSegmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Customer Segments</h1>
        <p className="mt-1 text-sm text-muted">Group customers for targeted marketing.</p>
      </div>

      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No segments defined"
        description="Create segments based on booking history, spend and loyalty."
      />
    </div>
  );
}
