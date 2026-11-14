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
import { ServiceCard } from "@/components/cards/service-card";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug }, include: { category: true } });
  if (!service) return { title: "Service not found" };
  return { title: service.name, description: service.description ?? undefined };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: true, addons: true },
  });

  if (!service) notFound();

  const related = await prisma.service.findMany({
    where: { categoryId: service.categoryId, isActive: true, id: { not: service.id } },
    take: 3,
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        eyebrow={service.category.name}
        title={service.name}
        subtitle={service.description ?? undefined}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-pastel-pink shadow-card">
              {service.imageUrl ? (
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">No image</div>
              )}
              <span className="absolute left-4 top-4">
                <Badge tone="rose">{service.category.name}</Badge>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Price</p>
                    <p className="text-3xl font-bold text-rose-gold">{formatMoney(service.priceCents)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">Duration</p>
                    <p className="flex items-center gap-1.5 text-lg font-semibold">
                      <Clock className="h-4 w-4 text-rose-gold" />
                      {service.durationMin} min
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/booking?service=${service.slug}`} className="btn-primary flex-1">
                    Book this service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="btn-outline">
                    <Phone className="h-4 w-4" />
                    Enquire
                  </Link>
                </div>
              </div>

              {service.addons.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold">Optional add-ons</h2>
                  <ul className="mt-4 space-y-3">
                    {service.addons.map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-rose-gold" />
                          {a.name}
                        </span>
                        <span className="text-sm font-semibold text-rose-gold">
                          +{formatMoney(a.priceCents)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="card p-6">
                <h2 className="text-lg font-bold">Good to know</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>Please arrive 10 minutes before your appointment.</li>
                  <li>Advance booking is recommended, especially for bridal services.</li>
                  <li>Prices are indicative and final pricing is confirmed during consultation.</li>
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
            <h2 className="text-2xl font-bold md:text-3xl">Related services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.05}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
