import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ServicesShowcaseClient, type ShowcaseService } from "./services-showcase-client";
import { getServices } from "@/lib/data";

export async function FeaturedServices() {
  const services = await getServices(9);
  const showcase: ShowcaseService[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    imageUrl: s.imageUrl,
    durationMin: s.durationMin,
    priceCents: s.priceCents,
    categoryName: s.category.name,
  }));

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Our Expertise"
          title="Signature Services"
          subtitle="Browse by category and book your favourite treatment in seconds."
        />
        {showcase.length === 0 ? (
          <Reveal className="mt-12 text-center text-muted">
            Services will appear here once the owner adds them.
          </Reveal>
        ) : (
          <ServicesShowcaseClient services={showcase} />
        )}
        <Reveal className="mt-12 text-center">
          <Link href="/services" className="btn-outline">
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
