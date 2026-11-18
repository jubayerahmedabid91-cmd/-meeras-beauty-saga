import { NextResponse } from "next/server";
import { getMedia } from "@/lib/media";

/**
 * Serves a media library file stored in the database.
 * Public by design — the public website and the admin preview both use it.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await getMedia(id).catch(() => null);

  if (!asset) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = Buffer.from(asset.dataBase64, "base64");

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(body.length),
      // Uploaded files are immutable; cache them hard.
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${asset.filename.replace(/"/g, "")}"`,
    },
  });
}
