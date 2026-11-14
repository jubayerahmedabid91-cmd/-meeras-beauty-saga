import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";

const schema = z.object({
  status: z.enum([
    "PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS",
    "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW",
  ]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "booking:update:any")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const data: Record<string, Date> = {};
  if (parsed.data.status === "CANCELLED") data.cancelledAt = new Date();
  if (parsed.data.status === "COMPLETED") data.completedAt = new Date();

  await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status, ...data },
  });

  return NextResponse.json({ ok: true });
}
