"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

/**
 * Touch-friendly, draggable Before & After comparison slider.
 *
 * Works with mouse, touch (pointer events + touch-none) and keyboard.
 * The whole image area is the handle: tap/drag anywhere to compare.
 */
export function BeforeAfterSlider({
  before,
  after,
  alt,
  sizes = "(max-width: 640px) 100vw, 90vw",
}: {
  before: string;
  after: string;
  alt: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  function update(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, next)));
  }

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={`Before and after comparison for ${alt}`}
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
        if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
      }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current || e.buttons === 1) update(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      className="absolute inset-0 cursor-ew-resize touch-none select-none"
    >
      <div className="absolute inset-y-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <Image
          src={before}
          alt={`Before - ${alt}`}
          fill
          sizes={sizes}
          className="object-cover object-left"
        />
        <span className="absolute left-3 top-3 rounded-full bg-charcoal/70 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-cream">
          Before
        </span>
      </div>
      <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
        After
      </span>
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-white text-charcoal shadow-lift">
          <MoveHorizontal className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
