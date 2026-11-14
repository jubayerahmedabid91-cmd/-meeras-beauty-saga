import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "New Invoice" };

export default function AdminNewInvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Invoice</h1>
        <p className="mt-1 text-sm text-muted">Create an invoice for a customer.</p>
      </div>

      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="Invoice builder"
        description="Invoice creation will be available once billing details are configured."
      />
    </div>
  );
}
