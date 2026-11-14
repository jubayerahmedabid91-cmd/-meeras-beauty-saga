import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getTeamProfiles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the specialists behind Meera's - The Beauty Saga.",
};

export default async function TeamPage() {
  const team = await getTeamProfiles();

  return (
    <>
      <PageHeader
        eyebrow="The People"
        title="Our Team"
        subtitle="Experienced, caring professionals dedicated to making you look and feel your best."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/team", label: "Our Team" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          {team.length === 0 ? (
            <Reveal className="text-center text-muted">
              Team profiles will appear here once added by the owner.
            </Reveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.05}>
                  <div className="card card-hover overflow-hidden">
                    <div className="relative aspect-square bg-pastel-pink">
                      {t.imageUrl ? (
                        <Image src={t.imageUrl} alt={t.name} fill sizes="25vw" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">No image</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold">{t.name}</h3>
                      <p className="text-sm text-rose-gold">{t.role}</p>
                      {t.bio && <p className="mt-2 text-xs leading-relaxed text-muted">{t.bio}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12 text-center">
            <Link href="/booking" className="btn-primary">
              Book with our team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
