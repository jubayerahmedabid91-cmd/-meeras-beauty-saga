"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Reveal } from "@/components/reveal";

export type LookbookImage = {
  id: string;
  src: string;
  alt: string;
};

/**
 * Bridal Lookbook — elegant grid with a full-screen lightbox
 * (arrow keys / Escape supported, swipe-friendly buttons).
 */
export function BridalLookbookClient({ images }: { images: LookbookImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length,
      );
    },
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.slice(0, 8).map((img, i) => (
          <Reveal key={img.id} delay={(i % 4) * 0.05}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-gold/25 bg-pastel-pink shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift"
              aria-label={`Open lookbook image: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="glass absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Expand className="h-4 w-4" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Bridal lookbook lightbox"
          onClick={close}
          style={{ animation: "fade-in 0.2s ease-out" }}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2.5 text-cream transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-cream transition hover:bg-white/20 md:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-cream transition hover:bg-white/20 md:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="relative max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[3/4] max-h-[85vh] w-full overflow-hidden rounded-[2rem] border border-gold/40 shadow-lift">
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                fill
                sizes="90vw"
                className="object-cover"
                priority
              />
            </div>
            <p className="mt-4 text-center text-sm font-semibold text-cream">
              {images[openIndex].alt}
            </p>
            <p className="mt-1 text-center text-xs text-cream/60">
              {openIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
