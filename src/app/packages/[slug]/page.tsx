import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Check, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/badge";
import { Reveal } from "@/components/reveal";
import { PackageCard } from "@/components/cards/package-card";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  if (!pkg) return { title: "Package not found" };
  return { title: pkg.name, description: pkg.description ?? undefined };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: { items: { include: { service: true } } },
  });

  if (!pkg) notFound();

  const finalPrice = pkg.priceCents - pkg.discountCents;
  const related = await prisma.package.findMany({
    where: { category: pkg.category, isActive: true, id: { not: pkg.id } },
    take: 3,
  });

  return (
    <>
      <PageHeader
        eyebrow={pkg.category}
        title={pkg.name}
        subtitle={pkg.description ?? undefined}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/packages", label: "Packages" },
          { href: `/packages/${pkg.slug}`, label: pkg.name },
        ]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-pastel-pink shadow-card">
              {pkg.imageUrl ? (
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">No image</div>
              )}
              <span className="absolute left-4 top-4">
                <Badge tone="charcoal">{pkg.category}</Badge>
              </span>
              {pkg.discountCents > 0 && (
                <span className="absolute right-4 top-4 rounded-full bg-rose-gold px-3 py-1.5 text-sm font-bold text-white">
                  Save {formatMoney(pkg.discountCents)}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Package price</p>
                    <p className="text-3xl font-bold text-rose-gold">{formatMoney(finalPrice)}</p>
                    {pkg.discountCents > 0 && (
                      <p className="mt-1 text-sm text-muted line-through">{formatMoney(pkg.priceCents)}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">Duration</p>
                    <p className="flex items-center gap-1.5 text-lg font-semibold">
                      <Clock className="h-4 w-4 text-rose-gold" />
                      {pkg.durationMin} min
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/booking?package=${pkg.slug}`} className="btn-primary flex-1">
                    Book this package
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="btn-outline">
                    <Phone className="h-4 w-4" />
                    Enquire
                  </Link>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold">What&rsquo;s included</h2>
                {pkg.items.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">Package contents will be listed here once configured.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {pkg.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-rose-gold" />
                          {item.service.name}
                          {item.quantity > 1 && <span className="text-muted">× {item.quantity}</span>}
                        </span>
                        <span className="text-sm font-semibold text-rose-gold">
                          {formatMoney(item.service.priceCents)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold">Validity &amp; terms</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>Valid for {pkg.validityDays} days from the date of booking.</li>
                  <li>Advance booking is required and subject to availability.</li>
                  {pkg.terms && <li>{pkg.terms}</li>}
                  <li>
                    Call us: <span className="font-medium text-charcoal">{BRAND.contact.phone}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pattern-surface py-16">
          <div className="container-site">
            <h2 className="text-2xl font-bold md:text-3xl">More {pkg.category.toLowerCase()} packages</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PackageCard package={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
