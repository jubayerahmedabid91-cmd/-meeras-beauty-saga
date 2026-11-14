import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { href: string; label: string }[];
}) {
  return (
    <section className="pattern-surface border-b border-charcoal/5 py-14 md:py-20">
      <div className="container-site">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted">
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-rose-gold">{b.label}</span>
                ) : (
                  <Link href={b.href} className="hover:text-rose-gold">
                    {b.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
