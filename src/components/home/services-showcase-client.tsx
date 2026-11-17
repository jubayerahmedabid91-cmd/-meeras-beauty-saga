"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { cn, formatMoney } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export type ShowcaseService = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  durationMin: number;
  priceCents: number;
  categoryName: string;
};

const TABS = [
  { key: "all", label: "All" },
  { key: "bridal", label: "Bridal" },
  { key: "hair", label: "Hair" },
  { key: "skin", label: "Skin" },
  { key: "nailspa", label: "Nail & Spa" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** Maps a DB category name to one of the showcase buckets. */
function bucketOf(categoryName: string): Exclude<TabKey, "all"> | "other" {
  const n = categoryName.toLowerCase();
  if (n.includes("bridal")) return "bridal";
  if (n.includes("skin") || n.includes("facial") || n.includes("makeup")) return "skin";
  if (n.includes("hair")) return "hair";
  if (n.includes("nail") || n.includes("spa")) return "nailspa";
  return "other";
}

/**
 * Category-tabbed luxury services showcase.
 * "Book Now" deep-links into /booking with the service pre-selected.
 */
export function ServicesShowcaseClient({ services }: { services: ShowcaseService[] }) {
  const [tab, setTab] = useState<TabKey>("all");

  const availableTabs = useMemo(() => {
    const present = new Set(services.map((s) => bucketOf(s.categoryName)));
    return TABS.filter(
      (t) => t.key === "all" || present.has(t.key as Exclude<TabKey, "all">) || (t.key === "nailspa" && present.has("other")),
    );
  }, [services]);

  const visible = useMemo(() => {
    if (tab === "all") return services;
    return services.filter((s) => bucketOf(s.categoryName) === tab);
  }, [services, tab]);

  return (
    <div>
      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
        {availableTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
              tab === t.key
                ? "border-gold bg-charcoal text-white shadow-card"
                : "border-charcoal/10 bg-white text-charcoal/70 hover:border-gold/60 hover:text-charcoal",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {visible.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted">
          No services in this category yet — check back soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.06}>
              <article className="card-luxury group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-pastel-pink">
                  {s.imageUrl ? (
                    <Image
                      src={s.imageUrl}
                      alt={s.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-rose-gold/40">
                      No image
                    </div>
                  )}
                  {/* duration badge */}
                  <span className="glass absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.65rem] font-bold text-charcoal shadow-soft">
                    <Clock className="h-3 w-3 text-gold-dark" />
                    {s.durationMin} min
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-cream backdrop-blur">
                    {s.categoryName}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-bold leading-snug">{s.name}</h3>
                  {s.description && (
                    <p className="line-clamp-2 text-sm text-muted">{s.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-base font-bold text-rose-gold">
                      {formatMoney(s.priceCents)}
                    </span>
                    <Link
                      href={`/booking?service=${encodeURIComponent(s.slug)}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-gold-dark hover:shadow-card"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Book Now
                    </Link>
                  </div>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-rose-gold hover:underline"
                  >
                    View details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
