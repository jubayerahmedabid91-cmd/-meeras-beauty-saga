import { prisma } from "@/lib/prisma";

/**
 * Media library storage.
 *
 * Uploaded files live in the database as base64 — never in temporary blob URLs
 * and never on the local disk, so they survive on serverless hosts (Netlify)
 * where the filesystem is read-only and ephemeral.
 *
 * Each file is one row in the existing `business_settings` table under the key
 * `media:<id>`. That keeps the library working without a schema migration while
 * staying fully persistent and queryable.
 */

export type StoredMedia = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  dataBase64: string;
  alt: string | null;
  caption: string | null;
  category: string;
  createdAt: string;
};

const PREFIX = "media:";

function parse(row: { key: string; value: string }): StoredMedia | null {
  try {
    const parsed = JSON.parse(row.value) as Partial<StoredMedia>;
    if (!parsed.id || !parsed.dataBase64) return null;
    return {
      id: parsed.id,
      filename: parsed.filename ?? "upload",
      mimeType: parsed.mimeType ?? "application/octet-stream",
      sizeBytes: parsed.sizeBytes ?? 0,
      dataBase64: parsed.dataBase64,
      alt: parsed.alt ?? null,
      caption: parsed.caption ?? null,
      category: parsed.category ?? "general",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function listMedia(): Promise<StoredMedia[]> {
  const rows = await prisma.businessSetting
    .findMany({ where: { key: { startsWith: PREFIX } } })
    .catch(() => []);

  return rows
    .map(parse)
    .filter((m): m is StoredMedia => m !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMedia(id: string): Promise<StoredMedia | null> {
  const row = await prisma.businessSetting
    .findUnique({ where: { key: `${PREFIX}${id}` } })
    .catch(() => null);
  return row ? parse(row) : null;
}

export async function createMedia(
  data: Omit<StoredMedia, "id" | "createdAt">,
): Promise<StoredMedia> {
  const id = `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const asset: StoredMedia = { ...data, id, createdAt: new Date().toISOString() };

  await prisma.businessSetting.upsert({
    where: { key: `${PREFIX}${id}` },
    update: { value: JSON.stringify(asset) },
    create: { key: `${PREFIX}${id}`, value: JSON.stringify(asset), label: `Media: ${asset.filename}` },
  });

  return asset;
}

export async function updateMedia(
  id: string,
  patch: Partial<Pick<StoredMedia, "alt" | "caption" | "category">>,
): Promise<StoredMedia | null> {
  const existing = await getMedia(id);
  if (!existing) return null;

  const next: StoredMedia = {
    ...existing,
    alt: patch.alt !== undefined ? patch.alt || null : existing.alt,
    caption: patch.caption !== undefined ? patch.caption || null : existing.caption,
    category: patch.category ?? existing.category,
  };

  await prisma.businessSetting.update({
    where: { key: `${PREFIX}${id}` },
    data: { value: JSON.stringify(next) },
  });

  return next;
}

export async function deleteMedia(id: string): Promise<boolean> {
  const existing = await getMedia(id);
  if (!existing) return false;
  await prisma.businessSetting.delete({ where: { key: `${PREFIX}${id}` } });
  return true;
}
