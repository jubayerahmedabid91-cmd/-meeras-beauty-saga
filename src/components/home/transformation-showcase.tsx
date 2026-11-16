import { getGalleryImages } from "@/lib/data";
import { ShowcaseClient } from "./showcase-client";

export async function TransformationShowcase() {
  const images = await getGalleryImages();

  return (
    <ShowcaseClient
      images={images.map((img) => ({
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
