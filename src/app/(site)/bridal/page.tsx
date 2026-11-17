import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Heart } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getPackages } from "@/lib/data";
import { PackageCard } from "@/components/cards/package-card";

export const metadata: Metadata = {
  title: "Bridal Services",
  description: "Complete bridal makeup, hair and styling services for your wedding day and related events at Meera's - The Beauty Saga.",
};

const INCLUSIONS = [
  "Bridal consultation and trial session",
  "HD / airbrush makeup with premium products",
  "Hairstyling and draping",
  "Saree / outfit draping and finishing",
  "Touch-up kit and on-day support",
];

export default async function BridalPage() {
  const packages = await getPackages();
  const bridalPackages = packages.filter((p) => p.category === "BRIDAL" || p.category === "COMBO").slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Bridal Services"
        title="Your most memorable day, beautifully styled"
        subtitle="From engagement to the wedding day, our bridal team creates a complete look tailored to you."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/bridal", label: "Bridal" }]}
      />

      <section className="bg-white py-16">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="The Bridal Experience"
              title="A look crafted around you"
              subtitle="Every bride is different. We begin with a consultation to understand your outfit, your venue, your skin and your comfort, then design a look that feels like you on your best day."
            />
            <Reveal delay={0.1} className="mt-8">
              <ul className="space-y-3">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-charcoal">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-gold/10 text-rose-gold">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary">
                Book a bridal consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Speak to our bridal team
              </Link>
            </Reveal>
          </div>

          <Reveal className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/assets/web/bridal/image_b00600e3.jpg"
                alt="Red bridal lehenga look"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card md:mt-8">
              <Image
                src="/assets/web/bridal/image_c2c6b202.jpg"
                alt="Bridal portrait with maang tikka"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {bridalPackages.length > 0 && (
        <section className="pattern-pink py-16">
          <div className="container-site">
            <SectionHeading
              eyebrow="Bridal Packages"
              title="Curated bridal bundles"
              subtitle="Complete packages covering makeup, hair and styling for your big day."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bridalPackages.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <PackageCard package={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-charcoal py-16 text-white">
        <div className="container-site text-center">
          <Heart className="mx-auto h-10 w-10 text-rose-gold-light" />
          <h2 className="mt-4 text-2xl font-bold md:text-3xl">Ready to plan your bridal look?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Book a consultation and let our bridal team design a look that is uniquely yours.
          </p>
          <div className="mt-8">
            <Link href="/booking" className="btn-primary">
              Book now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
