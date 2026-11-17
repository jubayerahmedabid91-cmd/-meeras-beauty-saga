import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Heart, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Favourites" };

export default async function CustomerFavouritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!customer) redirect("/auth/login");

  const favourites = await prisma.favorite.findMany({
    where: { customerId: customer.id },
    include: { service: { include: { category: true } }, package: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Favourites</h1>
        <p className="mt-1 text-sm text-muted">Services and packages you have saved for later.</p>
      </div>

      {favourites.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="No favourites yet"
          description="Save services and packages you love to find them quickly."
          action={<Link href="/services" className="btn-primary">Browse services</Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((fav) => {
            if (fav.service) {
              const s = fav.service;
              return (
                <Link key={fav.id} href={`/services/${s.slug}`} className="card card-hover overflow-hidden">
                  <div className="relative aspect-[4/3] bg-pastel-pink">
                    {s.imageUrl && (
                      <Image src={s.imageUrl} alt={s.name} fill sizes="33vw" className="object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-rose-gold">{s.category.name}</p>
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 text-sm font-bold text-rose-gold"><Price cents={s.priceCents} /></p>
                  </div>
                </Link>
              );
            }
            if (fav.package) {
              const p = fav.package;
              return (
                <Link key={fav.id} href={`/packages/${p.slug}`} className="card card-hover overflow-hidden">
                  <div className="relative aspect-[4/3] bg-pastel-pink">
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.name} fill sizes="33vw" className="object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-rose-gold">{p.category}</p>
                    <p className="font-semibold">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-rose-gold"><Price cents={p.priceCents - p.discountCents} /></p>
                  </div>
                </Link>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
