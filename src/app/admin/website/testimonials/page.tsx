import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { MessageSquareQuote } from "lucide-react";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminWebsiteTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">Customer testimonials displayed on the website.</p>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState icon={<MessageSquareQuote className="h-6 w-6" />} title="No testimonials" description="Testimonials will appear here once added." />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="mt-1 text-sm text-muted">{t.comment}</p>
                <p className="mt-1 text-xs text-rose-gold">Rating: {t.rating}/5</p>
              </div>
              <Badge tone={t.isVisible ? "rose" : "outline"}>{t.isVisible ? "Visible" : "Hidden"}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
