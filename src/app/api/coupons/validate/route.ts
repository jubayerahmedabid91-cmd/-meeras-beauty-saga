import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCoupon, normalizeCode } from "@/lib/coupons";

/** Public endpoint used by the booking wizard to validate a code live. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = normalizeCode(searchParams.get("code"));
  const subtotalCents = Number(searchParams.get("subtotalCents") ?? 0);

  if (!code) {
    return NextResponse.json({ ok: false, reason: "Enter a code." });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const result = evaluateCoupon(coupon, Number.isFinite(subtotalCents) ? subtotalCents : 0);

  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason });
  }

  return NextResponse.json({
    ok: true,
    code: result.coupon.code,
    description: result.coupon.description,
    type: result.coupon.type,
    discountCents: result.discountCents,
  });
}
