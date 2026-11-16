import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ReviewsCarousel } from "./reviews-carousel";
import { getTestimonials } from "@/lib/data";

export async function ReviewsPreview() {
  const testimonials = await getTestimonials(9);
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
          <ReviewsCarousel
            items={testimonials.map((t) => ({
              id: t.id,
              name: t.name,
              rating: t.rating,
              comment: t.comment,
              imageUrl: t.imageUrl,
            }))}
          />
        )}
      </div>
    </section>
  );
}
