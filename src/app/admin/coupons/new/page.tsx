import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "New Coupon" };

export default function AdminNewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Coupon</h1>
        <p className="mt-1 text-sm text-muted">Create a discount coupon code.</p>
      </div>

      <EmptyState
        icon={<Ticket className="h-6 w-6" />}
        title="Coupon builder"
        description="Coupon creation will be available once marketing settings are configured."
      />
    </div>
  );
}
