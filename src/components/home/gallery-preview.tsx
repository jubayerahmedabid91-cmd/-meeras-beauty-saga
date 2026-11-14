import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { getGalleryImages } from "@/lib/data";

export async function GalleryPreview() {
  const images = await getGalleryImages(6);
  return (
    <section className="pattern-surface py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Our Work"
          title="Gallery Preview"
          subtitle="A glimpse of the looks and moments created at Meera's."
        />
        {images.length === 0 ? (
          <Reveal className="mt-12 text-center text-muted">
            Gallery images will appear here once added.
          </Reveal>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img, i) => (
              <Reveal key={img.id} delay={i * 0.05}>
                <Link
                  href="/gallery"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-pastel-pink"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-10 text-center">
          <Link href="/gallery" className="btn-outline">
            Open full gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
