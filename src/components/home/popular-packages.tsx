import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { PackageCard } from "@/components/cards/package-card";
import { getFeaturedPackages } from "@/lib/data";

export async function PopularPackages() {
  const packages = await getFeaturedPackages(6);
  return (
    <section className="pattern-pink py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Curated Bundles"
          title="Popular Packages"
          subtitle="Thoughtfully bundled services for bridal, occasion and everyday care."
        />
        {packages.length === 0 ? (
          <Reveal className="mt-12 text-center text-muted">
            Packages will appear here once the owner adds them.
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <PackageCard package={p} />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-10 text-center">
          <Link href="/packages" className="btn-dark">
            Compare all packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
