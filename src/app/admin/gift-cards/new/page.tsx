import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Issue Gift Card" };

export default function AdminNewGiftCardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Issue Gift Card</h1>
        <p className="mt-1 text-sm text-muted">Create a gift card for a customer.</p>
      </div>

      <EmptyState
        icon={<Gift className="h-6 w-6" />}
        title="Gift card issuer"
        description="Gift card issuance will be available once gift card settings are configured."
      />
    </div>
  );
}
