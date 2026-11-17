"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  imageUrl: string | null;
};

export function ReviewsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / perView));
  const safeIndex = Math.min(index, pages - 1);

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || pages <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % pages), 7000);
    return () => clearInterval(id);
  }, [paused, pages]);

  const pagesList = useMemo(() => Array.from({ length: pages }, (_, i) => i), [pages]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, page) => (
            <div
              key={page}
              className="grid w-full shrink-0 grid-cols-1 gap-5 px-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.slice(page * perView, page * perView + perView).map((t, i) => (
                <figure
                  key={t.id}
                  className={cn(
                    "card-luxury relative flex h-full flex-col p-6",
                    i === 0 && "ring-1 ring-rose-gold/20",
                  )}
                >
                  <Quote className="absolute right-5 top-5 h-7 w-7 text-rose-gold/10" />
                  <div
                    className="flex gap-1 text-rose-gold relative z-10"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star
                        key={k}
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          k < t.rating ? "fill-rose-gold scale-100" : "fill-charcoal/10 text-charcoal/10 scale-80",
                        )}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal relative z-10">
                    &ldquo;{t.comment}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-charcoal/10 pt-4 relative z-10">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-gold/10 text-sm font-bold text-rose-gold">
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
              ))}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => setIndex((i) => (i - 1 + pages) % pages)}
            className="absolute -left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-charcoal/10 bg-white text-charcoal shadow-soft transition hover:border-rose-gold hover:text-rose-gold md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => setIndex((i) => (i + 1) % pages)}
            className="absolute -right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-charcoal/10 bg-white text-charcoal shadow-soft transition hover:border-rose-gold hover:text-rose-gold md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="mt-6 flex justify-center gap-2">
            {pagesList.map((p) => (
              <button
                key={p}
                type="button"
                aria-label={`Go to review page ${p + 1}`}
                onClick={() => setIndex(p)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  p === safeIndex ? "w-7 bg-rose-gold" : "w-1.5 bg-charcoal/20 hover:bg-charcoal/40",
                )}
              />
            ))}
          </div>
        </>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        Share your experience &mdash;{" "}
        <Link href="/contact" className="font-semibold text-rose-gold hover:underline">
          contact us
        </Link>
      </p>
    </div>
  );
}