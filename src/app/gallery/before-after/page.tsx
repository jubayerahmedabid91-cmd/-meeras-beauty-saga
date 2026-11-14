import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/empty-state";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Before & After",
  description: "See real hair and beauty transformations from Meera's - The Beauty Saga.",
};

export default async function BeforeAfterPage() {
  const images = await getGalleryImages();
  const pairs = images.filter((i) => i.beforeSrc && i.afterSrc);

  return (
    <>
      <PageHeader
        eyebrow="Transformations"
        title="Before &amp; After"
        subtitle="A look at the difference our specialists can make. Results vary by individual and service."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/gallery", label: "Gallery" },
          { href: "/gallery/before-after", label: "Before & After" },
        ]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          {pairs.length === 0 ? (
            <EmptyState
              title="No before & after pairs yet"
              description="Transformation comparisons will appear here once added by the owner."
            />
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {pairs.map((pair, i) => (
                <Reveal key={pair.id} delay={i * 0.05}>
                  <div className="card overflow-hidden">
                    <div className="grid grid-cols-2">
                      <div className="relative aspect-square bg-pastel-pink">
                        <Image
                          src={pair.beforeSrc!}
                          alt={`${pair.alt} - before`}
                          fill
                          sizes="50vw"
                          className="object-cover"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-xs font-semibold text-white">
                          Before
                        </span>
                      </div>
                      <div className="relative aspect-square bg-pastel-pink">
                        <Image
                          src={pair.afterSrc!}
                          alt={`${pair.alt} - after`}
                          fill
                          sizes="50vw"
                          className="object-cover"
                        />
                        <span className="absolute right-3 top-3 rounded-full bg-rose-gold px-3 py-1 text-xs font-semibold text-white">
                          After
                        </span>
                      </div>
                    </div>
                    <p className="p-5 text-sm font-medium text-charcoal">{pair.alt}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
