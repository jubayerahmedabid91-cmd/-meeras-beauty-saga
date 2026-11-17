import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BridalLookbookClient, type LookbookImage } from "./bridal-lookbook";
import { getGalleryImages } from "@/lib/data";

export async function BridalLookbook() {
  const images = await getGalleryImages(24);
  const bridal: LookbookImage[] = images
    .filter((img) => img.category === "bridal")
    .slice(0, 8)
    .map((img) => ({ id: img.id, src: img.afterSrc ?? img.src, alt: img.alt }));

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
