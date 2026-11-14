import Image from "next/image";
import Link from "next/link";
import { Clock, Check, ArrowRight } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/lib/brand";
import type { Package } from "@prisma/client";

export function PackageCard({ package: pkg }: { package: Package }) {
  const finalPrice = pkg.priceCents - pkg.discountCents;
  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-pastel-pink">
        {pkg.imageUrl ? (
          <Image
            src={pkg.imageUrl}
            alt={pkg.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-gold/40">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {pkg.category}
        </span>
        {pkg.discountCents > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-gold px-3 py-1 text-xs font-bold text-white">
            Save {formatMoney(pkg.discountCents)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold leading-snug">{pkg.name}</h3>
        {pkg.description && <p className="line-clamp-2 text-sm text-muted">{pkg.description}</p>}

        <div className="flex items-center gap-4 pt-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {pkg.durationMin} min
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-rose-gold" />
            {pkg.validityDays} days validity
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {pkg.discountCents > 0 && (
              <p className="text-xs text-muted line-through">{formatMoney(pkg.priceCents)}</p>
            )}
            <p className="text-xl font-bold text-rose-gold">{formatMoney(finalPrice)}</p>
          </div>
          <Link href={ROUTES.package(pkg.slug)} className="btn-primary !px-4 !py-2 text-xs">
            Book This Package
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
