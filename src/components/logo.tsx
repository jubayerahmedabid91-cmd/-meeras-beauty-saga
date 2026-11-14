import Image from "next/image";
import Link from "next/link";

/**
 * Official Meera's logo — the supplied brand mark (black circular badge with
 * "Meera's The Beauty SAGA"), cropped to the inner circle. The container is a
 * clean circle (rounded-full + aspect-square + overflow-hidden) and the image
 * uses object-cover with a slight zoom so the badge fills the circle without
 * showing square edges.
 */
export function LogoMark({
  className = "h-10 w-10",
  zoom = "scale-110",
}: {
  className?: string;
  zoom?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-charcoal ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/assets/logo.png"
        alt=""
        fill
        sizes="64px"
        className={`object-cover ${zoom}`}
        priority
      />
    </span>
  );
}

export function LogoWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="Meera's - The Beauty Saga home"
    >
      <LogoMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="flex flex-col leading-none">
        <span
          className="font-heading text-xl font-bold text-charcoal transition-colors group-hover:text-rose-gold md:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Meera&rsquo;s
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-rose-gold md:text-[0.65rem]">
          The Beauty Saga
        </span>
      </span>
    </Link>
  );
}
