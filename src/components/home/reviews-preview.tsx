import { Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { getTestimonials } from "@/lib/data";

export async function ReviewsPreview() {
  const testimonials = await getTestimonials(3);
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Client Love"
          title="What Our Clients Say"
          subtitle="Real feedback from people who trusted us with their look."
        />
        {testimonials.length === 0 ? (
          <Reveal className="mt-12 text-center text-muted">
            Client reviews will appear here once approved by the owner.
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.06}>
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
                    {t.name.startsWith("Demo") && (
                      <span className="ml-2 rounded-full bg-pastel-pink px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-rose-gold">
                        Demo
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
