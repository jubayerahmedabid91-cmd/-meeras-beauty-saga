import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";

const schema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  jobTitle: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
  commissionRate: z.number().min(0).max(100).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "staff:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid staff data." }, { status: 400 });
  }

  const { firstName, lastName, email, phone, jobTitle, password, commissionRate } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email: normalizedEmail,
      phone: phone || null,
      passwordHash,
      role: "STAFF",
      staff: {
        create: {
          firstName,
          lastName,
          jobTitle,
          phone: phone || null,
          commissionRate: commissionRate ?? 0,
        },
      },
    },
  });

  return NextResponse.json({ ok: true });
}
