import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";
import { deleteMedia, getMedia, updateMedia } from "@/lib/media";

const patchSchema = z.object({
  alt: z.string().max(200).optional(),
  caption: z.string().max(300).optional(),
  category: z.string().max(40).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "gallery:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const updated = await updateMedia(id, {
    alt: parsed.data.alt?.trim() ?? "",
    caption: parsed.data.caption?.trim() ?? "",
    category: parsed.data.category ?? undefined,
  });
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "media.updated",
    entity: "media",
    entityId: id,
    metadata: { changes: Object.keys(parsed.data) },
  });

  return NextResponse.json({ ok: true, url: `/api/media/${updated.id}` });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "gallery:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await getMedia(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await deleteMedia(id);

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "media.deleted",
    entity: "media",
    entityId: id,
    metadata: { filename: existing.filename },
  });

  return NextResponse.json({ ok: true });
}
