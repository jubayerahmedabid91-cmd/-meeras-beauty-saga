import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PackageCard } from "@/components/cards/package-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/section-heading";
import { getPackages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Packages",
  description: "Explore premium packages for bridal, makeup, hair, skin and special occasions at Meera's - The Beauty Saga.",
};

const CATEGORIES = ["ALL", "BRIDAL", "MAKEUP", "HAIR", "SKIN", "COMBO", "OCCASION", "FESTIVAL", "CUSTOM"];

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const packages = await getPackages();
  const active = category && category !== "ALL" ? category : null;
  const filtered = active ? packages.filter((p) => p.category === active) : packages;

  return (
    <>
      <PageHeader
        eyebrow="Curated Bundles"
        title="Our Packages"
        subtitle="Premium bundles combining our most loved services. Compare packages and choose the perfect fit for your occasion."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/packages", label: "Packages" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={c === "ALL" ? "/packages" : `/packages?category=${c}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
            <div className="mt-10">
              <EmptyState
                title="No packages found"
                description="No packages match your selection. Try a different category."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.04}>
                  <PackageCard package={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pattern-pink py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="Compare & Choose"
            title="Not sure which package fits?"
            subtitle="Our team can help you compare packages and customise one to your needs and budget."
          />
          <Reveal className="mt-8 text-center">
            <Link href="/contact" className="btn-primary">
              Talk to our team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
