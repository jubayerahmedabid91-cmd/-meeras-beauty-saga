import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const schema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  jobTitle: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
  role: z.enum(["STAFF", "RECEPTIONIST", "MANAGER", "ADMIN", "OWNER"]).default("STAFF"),
  commissionRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  jobTitle: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
  role: z.enum(["STAFF", "RECEPTIONIST", "MANAGER", "ADMIN", "OWNER"]).optional(),
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

  const { firstName, lastName, email, phone, jobTitle, password, role: newRole, commissionRate, isActive } = parsed.data;
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
      role: newRole,
      isActive: isActive ?? true,
      staff: {
        create: {
          firstName,
          lastName,
          jobTitle,
          phone: phone || null,
          commissionRate: commissionRate ?? 0,
          isActive: isActive ?? true,
        },
      },
    },
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "staff.created",
    entity: "staff",
    metadata: { email: normalizedEmail, role, name: `${firstName} ${lastName}` },
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

  const staff = await prisma.staff.findUnique({ where: { id: staffId }, include: { user: true } });
  if (!staff) return NextResponse.json({ error: "Staff member not found." }, { status: 404 });

  const staffData: Record<string, unknown> = {};
  const userData: Record<string, unknown> = {};

  if (updates.firstName) staffData.firstName = updates.firstName;
  if (updates.lastName) staffData.lastName = updates.lastName;
  if (updates.jobTitle) staffData.jobTitle = updates.jobTitle;
  if (updates.phone !== undefined) {
    staffData.phone = updates.phone;
    userData.phone = updates.phone || null;
  }
  if (updates.commissionRate !== undefined) staffData.commissionRate = updates.commissionRate;
  if (updates.isActive !== undefined) {
    staffData.isActive = updates.isActive;
    userData.isActive = updates.isActive;
  }
  if (updates.role) userData.role = updates.role;

  if (updates.email) {
    const normalizedEmail = updates.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing && existing.id !== staff.userId) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }
    userData.email = normalizedEmail;
  }

  if (updates.password) {
    userData.passwordHash = await bcrypt.hash(updates.password, 12);
  }

  await prisma.staff.update({
    where: { id: staffId },
    data: {
      ...staffData,
      user: { update: userData },
    },
    include: { user: true },
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "staff.updated",
    entity: "staff",
    entityId: staffId,
    metadata: { email: staff.user.email, changes: Object.keys(updates) },
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

  const staff = await prisma.staff.findUnique({ where: { id: staffId }, include: { user: true } });
  if (!staff) return NextResponse.json({ error: "Staff member not found." }, { status: 404 });

  const actorId = (session.user as { id: string }).id;
  if (staff.userId === actorId) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  // Never leave the business without an owner.
  if (staff.user.role === "OWNER") {
    const owners = await prisma.user.count({ where: { role: "OWNER", isActive: true } });
    if (owners <= 1) {
      return NextResponse.json({ error: "You cannot delete the only owner account." }, { status: 400 });
    }
  }

  // Deleting the user cascades to the staff profile.
  await prisma.user.delete({ where: { id: staff.userId } });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "staff.deleted",
    entity: "staff",
    entityId: staffId,
    metadata: { email: staff.user.email, role: staff.user.role },
  });

  return NextResponse.json({ ok: true });
}
