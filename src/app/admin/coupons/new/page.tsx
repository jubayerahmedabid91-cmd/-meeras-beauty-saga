import type { Metadata } from "next";
import { CouponForm } from "@/components/admin/coupon-form";

export const metadata: Metadata = { title: "New Coupon" };

export default function AdminNewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Coupon</h1>
        <p className="mt-1 text-sm text-muted">
          Create a discount code your customers can apply to a booking.
        </p>
      </div>

      <div className="card max-w-2xl p-6">
        <CouponForm />
      </div>
    </div>
  );
}
