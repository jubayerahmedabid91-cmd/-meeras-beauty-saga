import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().max(30).optional(),
  dateOfBirth: z.string().max(10).optional(),
  gender: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
});

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  const { firstName, lastName, phone, dateOfBirth, gender, address, city } = parsed.data;

  await prisma.customer.update({
    where: { userId: session.user.id },
    data: {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      address: address || null,
      city: city || null,
      user: { update: { phone: phone || null } },
    },
  });

  return NextResponse.json({ ok: true });
}
