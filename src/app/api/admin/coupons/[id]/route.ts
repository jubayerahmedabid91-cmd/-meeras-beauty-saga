import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  description: z.string().max(200).optional(),
  value: z.number().positive().optional(),
  type: z.enum(["PERCENT", "FIXED"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "coupon:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });

  const updated = await prisma.coupon.update({ where: { id }, data: parsed.data });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: parsed.data.isActive === undefined ? "coupon.updated" : parsed.data.isActive ? "coupon.activated" : "coupon.deactivated",
    entity: "coupon",
    entityId: id,
    metadata: { code: coupon.code },
  });

  return NextResponse.json({ ok: true, isActive: updated.isActive });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "coupon:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });

  await prisma.coupon.delete({ where: { id } });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "coupon.deleted",
    entity: "coupon",
    entityId: id,
    metadata: { code: coupon.code },
  });

  return NextResponse.json({ ok: true });
}
