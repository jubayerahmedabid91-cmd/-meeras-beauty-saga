import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BridalLookbookClient, type LookbookImage } from "./bridal-lookbook";
import { getGalleryImages } from "@/lib/data";

/**
 * Owner-supplied bridal photographs (public/assets/web/bridal).
 *
 * The gallery table holds only a few bridal shots, which the gallery preview
 * already uses. To keep the lookbook from repeating the same images it also
 * draws from the remaining owner-supplied bridal assets.
 */
const BRIDAL_ASSETS = [
  "/assets/web/bridal/image_3f2cab75.jpg",
  "/assets/web/bridal/image_6702e8bc.jpg",
  "/assets/web/bridal/image_7eb82ff9.jpg",
  "/assets/web/bridal/image_afb770d5.jpg",
  "/assets/web/bridal/image_b00600e3.jpg",
  "/assets/web/bridal/image_c2c6b202.jpg",
  "/assets/web/bridal/image_d26a8d80.jpg",
  "/assets/web/bridal/image_d941418.jpg",
  "/assets/web/bridal/image_fc0e44fa.jpg",
];

export async function BridalLookbook() {
  const images = await getGalleryImages(24);

  // Bridal shots already shown in the gallery preview / hero.
  const alreadyShown = new Set(
    images.filter((img) => img.category === "bridal").map((img) => img.src),
  );
  const fresh = BRIDAL_ASSETS.filter((src) => !alreadyShown.has(src));

  const bridal: LookbookImage[] = [
    ...images
      .filter((img) => img.category === "bridal")
      .map((img) => ({ id: img.id, src: img.afterSrc ?? img.src, alt: img.alt })),
    ...fresh.map((src, i) => ({
      id: `asset-${i}`,
      src,
      alt: "Bridal look at Meera's - The Beauty Saga",
    })),
  ].slice(0, 8);

  return (
    <section className="pattern-surface py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="The Bridal Lookbook"
          title="Real Brides, Timeless Looks"
          subtitle="A curated gallery of signature bridal transformations crafted at Meera's. Tap any look to view it full-screen."
        />
        <BridalLookbookClient images={bridal} />
        <Reveal className="mt-12 text-center">
          <Link href="/bridal" className="btn-outline">
            Explore bridal packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
