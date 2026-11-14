import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dates." }, { status: 400 });
  }

  const staff = await prisma.staff.findUnique({ where: { userId: session.user.id } });
  if (!staff) {
    return NextResponse.json({ error: "Staff profile not found." }, { status: 404 });
  }

  await prisma.leaveRequest.create({
    data: {
      staffId: staff.id,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      reason: parsed.data.reason || null,
    },
  });

  return NextResponse.json({ ok: true });
}
