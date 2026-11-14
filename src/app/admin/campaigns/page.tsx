import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Campaigns" };

export default function AdminCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Campaigns</h1>
        <p className="mt-1 text-sm text-muted">Marketing campaigns and promotions.</p>
      </div>

      <EmptyState
        icon={<Megaphone className="h-6 w-6" />}
        title="No campaigns yet"
        description="Campaign management will be available once marketing tools are configured."
      />
    </div>
  );
}
