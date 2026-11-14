import type { Metadata } from "next";
import { Tags } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "New Category" };

export default function AdminNewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Category</h1>
        <p className="mt-1 text-sm text-muted">Create a service category.</p>
      </div>

      <EmptyState
        icon={<Tags className="h-6 w-6" />}
        title="Category builder"
        description="Category creation will be available once category settings are configured."
      />
    </div>
  );
}
