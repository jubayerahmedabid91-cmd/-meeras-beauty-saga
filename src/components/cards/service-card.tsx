import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/lib/brand";
import type { Service, ServiceCategory } from "@prisma/client";

type ServiceWithCategory = Service & { category: ServiceCategory };

export function ServiceCard({ service }: { service: ServiceWithCategory }) {
  return (
    <Link
      href={ROUTES.service(service.slug)}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-pastel-pink">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-gold/40">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-charcoal backdrop-blur">
          {service.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold leading-snug">{service.name}</h3>
        {service.description && (
          <p className="line-clamp-2 text-sm text-muted">{service.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" />
            {service.durationMin} min
          </span>
          <span className="text-base font-bold text-rose-gold">{formatMoney(service.priceCents)}</span>
        </div>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-rose-gold">
          View details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
