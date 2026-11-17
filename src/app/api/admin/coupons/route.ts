import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";

const schema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, dashes and underscores only")
    .transform((v) => v.toUpperCase().trim()),
  description: z.string().max(200).optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  minSpendCents: z.number().nonnegative().default(0),
  maxUses: z.number().positive().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "coupon:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid coupon." },
      { status: 400 },
    );
  }

  const { code, description, type, value, minSpendCents, maxUses, startsAt, endsAt } = parsed.data;

  if (type === "PERCENT" && value > 100) {
    return NextResponse.json({ error: "Percent discount cannot exceed 100." }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "That code already exists." }, { status: 409 });
  }

  await prisma.coupon.create({
    data: {
      code,
      description: description || null,
      type,
      value,
      minSpendCents,
      maxUses: maxUses ?? null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      isActive: true,
    },
  });

  return NextResponse.json({ ok: true });
}
