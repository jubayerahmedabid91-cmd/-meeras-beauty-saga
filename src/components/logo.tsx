import Image from "next/image";
import Link from "next/link";

/**
 * Official Meera's logo — the supplied brand mark (black circular badge with
 * "Meera's The Beauty SAGA"), cropped to the inner circle. The container is a
 * clean circle (rounded-full + aspect-square + overflow-hidden) and the image
 * uses object-cover with a slight zoom so the badge fills the circle without
 * showing square edges.
 *
 * When the owner configures a custom logo (Admin -> Settings -> Brand & Logo,
 * stored as the `logo_url` business setting), it replaces the built-in mark.
 * Local paths go through next/image; arbitrary external URLs use a plain img
 * so no remote-host allowlist is needed.
 */
export function LogoMark({
  className = "h-10 w-10",
  zoom = "scale-110",
  logoUrl,
}: {
  className?: string;
  zoom?: string;
  logoUrl?: string | null;
}) {
  const custom = logoUrl?.trim();
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-charcoal ${className}`}
      aria-hidden="true"
    >
      {custom ? (
        custom.startsWith("/") ? (
          <Image src={custom} alt="" fill sizes="64px" className={`object-cover ${zoom}`} priority />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={custom} alt="" className={`absolute inset-0 h-full w-full object-cover ${zoom}`} />
        )
      ) : (
        <Image
          src="/assets/logo.png"
          alt=""
          fill
          sizes="64px"
          className={`object-cover ${zoom}`}
          priority
        />
      )}
    </span>
  );
}

export function LogoWordmark({
  compact = false,
  logoUrl,
}: {
  compact?: boolean;
  logoUrl?: string | null;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="Meera's - The Beauty Saga home"
    >
      <LogoMark className={compact ? "h-9 w-9" : "h-11 w-11"} logoUrl={logoUrl} />
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
