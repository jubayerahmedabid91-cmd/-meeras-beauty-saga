import type { Coupon } from "@prisma/client";

export type CouponCheck =
  | { ok: true; coupon: Coupon; discountCents: number }
  | { ok: false; reason: string };

/**
 * Validates a coupon against an order subtotal and returns the discount.
 * Pure function — the server recomputes the discount for every booking,
 * so a tampered client can never invent a discount.
 */
export function evaluateCoupon(
  coupon: Coupon | null,
  subtotalCents: number,
  now = new Date(),
): CouponCheck {
  if (!coupon) return { ok: false, reason: "That code is not valid." };
  if (!coupon.isActive) return { ok: false, reason: "This coupon is no longer active." };

  if (coupon.startsAt && now < coupon.startsAt) {
    return { ok: false, reason: "This coupon is not valid yet." };
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    return { ok: false, reason: "This coupon has expired." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, reason: "This coupon has reached its usage limit." };
  }
  if (subtotalCents < coupon.minSpendCents) {
    return {
      ok: false,
      reason: `Requires a minimum spend of ${(coupon.minSpendCents / 100).toFixed(0)}.`,
    };
  }

  const discountCents =
    coupon.type === "PERCENT"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : coupon.value;

  return { ok: true, coupon, discountCents: Math.min(discountCents, subtotalCents) };
}

export function normalizeCode(value: string | null | undefined): string {
  return (value ?? "").toUpperCase().trim();
}
