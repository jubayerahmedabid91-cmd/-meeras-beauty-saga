import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "New Sale" };

export default function AdminNewSalePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Sale</h1>
        <p className="mt-1 text-sm text-muted">Create a counter sale and print a receipt.</p>
      </div>

      <EmptyState
        icon={<ShoppingCart className="h-6 w-6" />}
        title="POS terminal"
        description="The interactive POS terminal will open here once products and payment methods are configured."
      />
    </div>
  );
}
