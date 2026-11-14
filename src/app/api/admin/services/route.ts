import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().max(100).optional(),
  categoryId: z.string().min(1),
  description: z.string().max(2000).optional(),
  durationMin: z.number().int().min(1).max(600),
  priceCents: z.number().int().min(0),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "service:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid service data." }, { status: 400 });
  }

  await prisma.service.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      categoryId: parsed.data.categoryId,
      description: parsed.data.description || null,
      durationMin: parsed.data.durationMin,
      priceCents: parsed.data.priceCents,
      isActive: parsed.data.isActive ?? true,
      isFeatured: parsed.data.isFeatured ?? false,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  return NextResponse.json({ ok: true });
}
