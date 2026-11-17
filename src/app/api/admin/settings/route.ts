import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";

/**
 * Persists business settings.
 *
 * Two payload shapes are supported:
 *  1. Flat:  { keys: ["phone", ...], values: { phone: "...", ... } }
 *  2. Nested: { nestedKey: "social", values: { social: { instagram: ... } } }
 *
 * The nested shape previously saved nothing (the loop read values[key] while
 * the payload was wrapped under values[nestedKey]) — that made the Booking
 * Rules and Social Links forms look like frontend-only Save buttons.
 */
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "settings:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const body = (await request.json()) as {
    keys?: string[];
    values?: Record<string, unknown>;
    nestedKey?: string;
  };
  const { keys, values, nestedKey } = body;

  if (!values || typeof values !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (nestedKey) {
    // Whole-object settings (e.g. `social`, `booking`) are stored as one JSON value.
    const value = values[nestedKey];
    if (value === undefined) {
      return NextResponse.json({ error: "Missing nested value." }, { status: 400 });
    }
    await prisma.businessSetting.upsert({
      where: { key: nestedKey },
      update: { value: JSON.stringify(value) },
      create: { key: nestedKey, value: JSON.stringify(value), label: nestedKey },
    });
    return NextResponse.json({ ok: true });
  }

  if (!Array.isArray(keys)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

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
