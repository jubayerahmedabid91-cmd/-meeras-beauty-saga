import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "settings:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const body = await request.json();
  const { keys, values } = body as { keys: string[]; values: Record<string, unknown> };

  for (const key of keys) {
    const value = values[key];
    if (value === undefined) continue;
    const stored = typeof value === "object" ? JSON.stringify(value) : String(value);
    await prisma.businessSetting.upsert({
      where: { key },
      update: { value: stored },
      create: { key, value: stored, label: key },
    });
  }

  return NextResponse.json({ ok: true });
}
