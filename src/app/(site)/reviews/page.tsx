import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";
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
            <Reveal className="text-center text-muted py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold/10 text-rose-gold">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">No reviews yet</h3>
              <p className="mt-2 max-w-md mx-auto">Verified client reviews will appear here once approved by the owner.</p>
              <Link href="/booking" className="mt-6 inline-flex items-center gap-2 btn-primary">
                Book your appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          ) : (
            <div className="stagger-entrance grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.05}>
                  <figure className="card-luxury flex h-full flex-col p-6 relative">
                    <Quote className="absolute right-6 top-6 h-10 w-10 text-rose-gold/10" />
                    <div
                      className="flex gap-1 text-rose-gold relative z-10"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className="h-5 w-5 transition-transform duration-300"
                          style={{
                            transform: k < t.rating ? "scale(1)" : "scale(0.8)",
                            color: k < t.rating ? "currentColor" : "#e5e5e5",
                          }}
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal relative z-10">
                      &ldquo;{t.comment}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-charcoal/10 pt-4 relative z-10">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-gold/10 text-sm font-bold text-rose-gold">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="text-[0.65rem] uppercase tracking-wide text-muted">
                          Verified client
                        </p>
                      </div>
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