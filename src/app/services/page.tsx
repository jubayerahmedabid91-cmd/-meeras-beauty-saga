import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/cards/service-card";
import { EmptyState } from "@/components/empty-state";
import { getServices, getCategories } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore our full range of hair, makeup, bridal and skin care services at Meera's - The Beauty Saga.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [services, categories] = await Promise.all([getServices(), getCategories()]);

  const filtered = category
    ? services.filter((s) => s.category.slug === category)
    : services;

  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Our Services"
        subtitle="Hair, makeup, bridal and skin care services tailored to you. Prices shown are indicative and confirmed at booking."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/services"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !category ? "bg-rose-gold text-white" : "bg-pastel-pink text-charcoal hover:bg-rose-gold-light"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/services?category=${c.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === c.slug
                    ? "bg-rose-gold text-white"
                    : "bg-pastel-pink text-charcoal hover:bg-rose-gold-light"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="No services found"
                description="No services match your selection. Try a different category."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.04}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pattern-pink py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="Not Sure?"
            title="Let us help you choose"
            subtitle="Tell us what you need and our team will recommend the right service and specialist."
          />
          <Reveal className="mt-8 text-center">
            <Link href="/contact" className="btn-primary">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
