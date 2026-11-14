import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, Gift, Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getFeaturedPackages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Offers & Promotions",
  description: "Current offers, seasonal packages and promotions at Meera's - The Beauty Saga.",
};

export default async function OffersPage() {
  const packages = await getFeaturedPackages(3);

  return (
    <>
      <PageHeader
        eyebrow="Special Offers"
        title="Offers &amp; Promotions"
        subtitle="Seasonal and occasion packages crafted to give you more value. Offers are updated by the owner."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/offers", label: "Offers" }]}
      />

      <section className="pattern-pink py-16">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BadgePercent,
                title: "Seasonal Packages",
                text: "Bundled services at special prices for festivals and seasonal occasions.",
              },
              {
                icon: Gift,
                title: "Gift Cards",
                text: "Give the gift of beauty. Gift cards available in salon and online.",
              },
              {
                icon: Calendar,
                title: "Advance Booking",
                text: "Book ahead to secure your preferred slot with our senior specialists.",
              },
            ].map((o, i) => (
              <Reveal key={o.title} delay={i * 0.06}>
                <div className="card card-hover flex h-full flex-col gap-3 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold">{o.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{o.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {packages.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-site">
            <h2 className="text-2xl font-bold md:text-3xl">Featured promotional packages</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {packages.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="card card-hover group block overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] bg-pastel-pink">
                      <Image
                        src={p.imageUrl ?? "/assets/web/bridal/image_41c14ae9.jpg"}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.discountCents > 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-rose-gold px-3 py-1 text-xs font-bold text-white">
                          Save ${p.discountCents / 100}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-gold">
                        View package
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
