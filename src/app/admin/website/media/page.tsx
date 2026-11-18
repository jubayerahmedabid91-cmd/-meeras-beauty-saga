import type { Metadata } from "next";
import { getBusinessSetting } from "@/lib/data";
import { listMedia } from "@/lib/media";
import { MediaLibrary, type MediaItem } from "@/components/admin/media-library";

export const metadata: Metadata = { title: "Media Library" };

const LOGO_KEYS = ["logo_url", "logo_footer_url", "logo_mobile_url", "favicon_url"];

export default async function AdminMediaPage() {
  const [assets, ...logoValues] = await Promise.all([
    listMedia(),
    ...LOGO_KEYS.map((key) => getBusinessSetting<string>(key, "")),
  ]);

  const logos: Record<string, string> = {};
  LOGO_KEYS.forEach((key, i) => {
    logos[key] = logoValues[i];
  });

  const items: MediaItem[] = assets.map((a) => ({
    id: a.id,
    url: `/api/media/${a.id}`,
    filename: a.filename,
    mimeType: a.mimeType,
    sizeBytes: a.sizeBytes,
    alt: a.alt,
    caption: a.caption,
    category: a.category,
    createdAt: a.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Media Library</h1>
        <p className="mt-1 text-sm text-muted">
          Upload photos once and reuse them across the website, gallery and brand logos.
        </p>
      </div>

      <MediaLibrary items={items} logos={logos} />
    </div>
  );
}
