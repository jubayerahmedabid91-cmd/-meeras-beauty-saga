import type { Metadata } from "next";
import { Boxes } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Add Product" };

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Add Product</h1>
        <p className="mt-1 text-sm text-muted">Add a product to your inventory.</p>
      </div>

      <EmptyState
        icon={<Boxes className="h-6 w-6" />}
        title="Product form"
        description="Product creation will be available once inventory settings are configured."
      />
    </div>
  );
}
