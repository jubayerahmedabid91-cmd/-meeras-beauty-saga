import { getGalleryImages } from "@/lib/data";
import { ShowcaseClient } from "./showcase-client";

export async function TransformationShowcase() {
  const images = await getGalleryImages();

  // Only real paired photos are shown — never two unrelated images presented
  // as a transformation.
  const pairs = images.filter(
    (img) => img.beforeSrc && img.afterSrc && img.beforeSrc !== img.afterSrc,
  );

  return (
    <ShowcaseClient
      images={pairs.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        category: img.category,
        beforeSrc: img.beforeSrc,
        afterSrc: img.afterSrc,
      }))}
    />
  );
}
