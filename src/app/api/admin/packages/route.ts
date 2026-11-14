import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().max(100).optional(),
  category: z.string().max(20),
  description: z.string().max(2000).optional(),
  durationMin: z.number().int().min(1).max(1200),
  priceCents: z.number().int().min(0),
  discountCents: z.number().int().min(0).optional(),
  validityDays: z.number().int().min(1).optional(),
  terms: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "package:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid package data." }, { status: 400 });
  }

  await prisma.package.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      category: parsed.data.category,
      description: parsed.data.description || null,
      durationMin: parsed.data.durationMin,
      priceCents: parsed.data.priceCents,
      discountCents: parsed.data.discountCents ?? 0,
      validityDays: parsed.data.validityDays ?? 90,
      terms: parsed.data.terms || null,
      isActive: parsed.data.isActive ?? true,
      isFeatured: parsed.data.isFeatured ?? false,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  return NextResponse.json({ ok: true });
}
