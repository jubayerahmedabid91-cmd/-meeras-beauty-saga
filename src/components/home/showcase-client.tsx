"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "@/components/before-after-slider";

type ShowcaseImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
  beforeSrc: string | null;
  afterSrc: string | null;
};

const CATEGORY_ORDER = ["bridal", "hair", "makeup", "fashion"];

const CATEGORY_LABEL: Record<string, string> = {
  bridal: "Bridal Makeover",
  hair: "Hair Transformation",
  makeup: "Skin & Makeup",
  fashion: "Editorial & Fashion",
};

export function ShowcaseClient({ images }: { images: ShowcaseImage[] }) {
  const categories = useMemo(() => {
    const present = Array.from(new Set(images.map((i) => i.category)));
    return CATEGORY_ORDER.filter((c) => present.includes(c)).concat(
      present.filter((c) => !CATEGORY_ORDER.includes(c)),
    );
  }, [images]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (categories.length <= 1 || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % categories.length), 6500);
    return () => clearInterval(id);
  }, [categories.length, paused]);

  if (categories.length === 0) return null;

  const activeCategory = categories[Math.min(active, categories.length - 1)];
  const inCategory = images.filter((i) => i.category === activeCategory);
  const pair = inCategory.find((i) => i.beforeSrc && i.afterSrc && i.beforeSrc !== i.afterSrc);
  const featured = pair ?? inCategory[0];
  if (!featured) return null;

  const hasComparison = Boolean(pair);

  return (
    <section className="bg-charcoal py-16 text-cream md:py-24">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-gold">
              Before &amp; After
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">Transformation Showcase</h2>
            <p className="mt-3 max-w-xl text-sm text-cream/70">
              Real makeovers crafted by our specialists &mdash; bridal, hair and skin, from first
              consultation to the final reveal.
            </p>
          </div>
          <Link
            href="/gallery/before-after"
            className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream transition hover:border-rose-gold hover:text-rose-gold"
          >
            View all transformations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300",
                  i === active
                    ? "border-rose-gold bg-rose-gold/15 text-rose-gold"
                    : "border-cream/15 bg-white/5 text-cream/70 hover:border-cream/40 hover:text-cream",
                )}
              >
                {CATEGORY_LABEL[cat] ?? cat}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cream/10 bg-white/5 shadow-lift">
            <div className="relative aspect-[4/3] sm:aspect-[16/9]">
              <Image
                src={featured.afterSrc ?? featured.src}
                alt={featured.alt}
                fill
                sizes="(max-width: 640px) 100vw, 90vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-charcoal/70 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-cream backdrop-blur sm:left-6 sm:top-6">
                <Sparkles className="h-3.5 w-3.5 text-rose-gold" />
                {CATEGORY_LABEL[activeCategory] ?? activeCategory}
              </div>
              {hasComparison && <BeforeAfterSlider before={featured.beforeSrc!} after={featured.afterSrc!} alt={featured.alt} />}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
                <p className="text-lg font-bold sm:text-2xl">{featured.alt}</p>
                <p className="mt-1 text-xs text-cream/70 sm:text-sm">
                  {hasComparison
                    ? "Drag the handle to compare the before and after look."
                    : "Crafted by our specialist team with premium products."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat}
                type="button"
                aria-label={`Show ${cat} transformations`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-7 bg-rose-gold" : "w-1.5 bg-cream/25 hover:bg-cream/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
