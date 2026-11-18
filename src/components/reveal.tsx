"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
};

/**
 * Lightweight scroll-reveal wrapper.
 *
 * Content is visible by default (SSR-safe). Once hydrated, sections below the
 * fold are hidden and animate in when they enter the viewport. If JS is
 * disabled the content remains fully visible.
 */
export function Reveal({ children, delay = 0, className, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only hide sections that are currently below the viewport.
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) return;

    // Reset before deciding whether this element should animate in.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);

    if (typeof IntersectionObserver === "undefined") {
      // Immediate reveal on browsers without IntersectionObserver.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);

    // Safety net: never leave content hidden.
    const fallback = setTimeout(() => setVisible(true), 2500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
