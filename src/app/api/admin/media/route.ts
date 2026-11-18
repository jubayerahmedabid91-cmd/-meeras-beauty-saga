import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";
import { createMedia } from "@/lib/media";

/** 3 MB — files live in the database, so keep uploads modest. */
const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

const CATEGORIES = ["general", "logo", "gallery", "bridal", "service", "team", "before-after"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "gallery:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPG, WEBP, GIF or SVG images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (maximum 3 MB)." }, { status: 400 });
  }

  const category = String(form?.get("category") ?? "general");
  const alt = String(form?.get("alt") ?? "").slice(0, 200) || null;
  const caption = String(form?.get("caption") ?? "").slice(0, 300) || null;

  const buffer = Buffer.from(await file.arrayBuffer());

  const asset = await createMedia({
    filename: file.name || "upload",
    mimeType: file.type,
    sizeBytes: file.size,
    dataBase64: buffer.toString("base64"),
    alt,
    caption,
    category: CATEGORIES.includes(category) ? category : "general",
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "media.uploaded",
    entity: "media",
    entityId: asset.id,
    metadata: { filename: asset.filename, mimeType: asset.mimeType, sizeBytes: asset.sizeBytes },
  });

  return NextResponse.json({
    ok: true,
    id: asset.id,
    url: `/api/media/${asset.id}`,
    filename: asset.filename,
  });
}
