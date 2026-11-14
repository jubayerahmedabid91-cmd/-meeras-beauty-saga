import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our gallery of bridal, makeup, hair and fashion looks created at Meera's - The Beauty Saga.",
};

const CATEGORIES = ["ALL", "bridal", "makeup", "hair", "fashion"];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const images = await getGalleryImages();
  const active = category && category !== "ALL" ? category : null;
  const filtered = active ? images.filter((i) => i.category === active) : images;

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Gallery"
        subtitle="A curated look at the styles, moments and transformations created at Meera's."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/gallery", label: "Gallery" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={c === "ALL" ? "/gallery" : `/gallery?category=${c}`}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  (active ?? "ALL") === c
                    ? "bg-rose-gold text-white"
                    : "bg-pastel-pink text-charcoal hover:bg-rose-gold-light"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Reveal className="mt-10 text-center text-muted">
              No images in this category yet. Check back soon.
            </Reveal>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((img, i) => (
                <Reveal key={img.id} delay={i * 0.04}>
                  <div className="group relative aspect-square overflow-hidden rounded-2xl bg-pastel-pink">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="p-4 text-xs font-medium text-white">{img.alt}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12 text-center">
            <Link href="/gallery/before-after" className="btn-outline">
              View before &amp; after
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
