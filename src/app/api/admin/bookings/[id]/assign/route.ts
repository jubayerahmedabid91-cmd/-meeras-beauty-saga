import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const schema = z.object({
  staffId: z.string().min(1),
});

/** Assigns a specialist to a booking straight from the bookings table. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "booking:assign")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a specialist." }, { status: 400 });
  }

  const staff = await prisma.staff.findUnique({
    where: { id: parsed.data.staffId },
    include: { user: true },
  });
  if (!staff) return NextResponse.json({ error: "Specialist not found." }, { status: 404 });

  await prisma.booking.update({ where: { id }, data: { staffId: staff.id } });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "booking.assigned",
    entity: "booking",
    entityId: id,
    metadata: {
      staff: `${staff.firstName} ${staff.lastName}`,
      staffEmail: staff.user.email,
    },
  });

  return NextResponse.json({ ok: true });
}
