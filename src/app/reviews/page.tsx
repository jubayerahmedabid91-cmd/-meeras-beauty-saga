import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what our clients say about their experience at Meera's - The Beauty Saga.",
};

export default async function ReviewsPage() {
  const testimonials = await getTestimonials(20);

  return (
    <>
      <PageHeader
        eyebrow="Client Love"
        title="Customer Reviews"
        subtitle="Honest feedback from people who trusted us with their look."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/reviews", label: "Reviews" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          {testimonials.length === 0 ? (
            <Reveal className="text-center text-muted">
              Reviews will appear here once approved by the owner.
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.05}>
                  <figure className="card card-hover flex h-full flex-col p-6">
                    <div className="flex gap-1 text-rose-gold">
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-rose-gold" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal">
                      &ldquo;{t.comment}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 border-t border-charcoal/10 pt-4 text-sm font-semibold">
                      {t.name}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12 text-center">
            <Link href="/booking" className="btn-primary">
              Book your appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
