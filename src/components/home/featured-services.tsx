import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/cards/service-card";
import { getFeaturedServices } from "@/lib/data";

export async function FeaturedServices() {
  const services = await getFeaturedServices(6);
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Our Expertise"
          title="Featured Services"
          subtitle="Signature treatments and styling, delivered by our specialist team."
        />
        {services.length === 0 ? (
          <Reveal className="mt-12 text-center text-muted">
            Services will appear here once the owner adds them.
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-10 text-center">
          <Link href="/services" className="btn-outline">
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
