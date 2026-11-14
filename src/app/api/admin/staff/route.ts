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

const updateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  jobTitle: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "staff:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const staff = await prisma.staff.findMany({
    include: { user: true, _count: { select: { bookings: true } } },
    orderBy: { hiredAt: "desc" },
  });

  return NextResponse.json(staff);
}

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

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "staff:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("id");
  if (!staffId) return NextResponse.json({ error: "Staff ID required." }, { status: 400 });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid staff data." }, { status: 400 });
  }

  const updates = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (updates.firstName) updateData.firstName = updates.firstName;
  if (updates.lastName) updateData.lastName = updates.lastName;
  if (updates.jobTitle) updateData.jobTitle = updates.jobTitle;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.commissionRate !== undefined) updateData.commissionRate = updates.commissionRate;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

  if (updates.email) {
    const normalizedEmail = updates.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing && existing.id !== staffId) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }
    updateData.email = normalizedEmail;
  }

  if (updates.password) {
    updateData.passwordHash = await bcrypt.hash(updates.password, 12);
  }

  await prisma.staff.update({
    where: { id: staffId },
    data: updateData,
    include: { user: true },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "staff:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("id");
  if (!staffId) return NextResponse.json({ error: "Staff ID required." }, { status: 400 });

  await prisma.staff.delete({ where: { id: staffId } });

  return NextResponse.json({ ok: true });
}
