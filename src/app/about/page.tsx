import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Award, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getTeamProfiles, getServices } from "@/lib/data";
import { ServiceCard } from "@/components/cards/service-card";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover the story, mission and values behind Meera's - The Beauty Saga premium beauty salon.",
};

const VALUES = [
  { icon: Heart, title: "Personal Care", text: "Every service begins with understanding your style, skin and preferences." },
  { icon: Shield, title: "Trusted Products", text: "We use premium, skin-safe products chosen for lasting, healthy results." },
  { icon: Award, title: "Refined Craft", text: "Our specialists focus on detail, so every look feels polished and confident." },
];

export default async function AboutPage() {
  const [team, services] = await Promise.all([getTeamProfiles(), getServices(3)]);

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About Meera's"
        subtitle="A premium beauty salon dedicated to helping you look and feel your best, one detail at a time."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/about", label: "About Us" }]}
      />

      <section className="bg-white py-16">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-pastel-pink shadow-card">
              <Image
                src="/assets/web/makeup/image_95d850bf.jpg"
                alt="Makeup artistry at Meera's"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-charcoal p-5 text-white shadow-lift md:block">
              <p className="text-xs uppercase tracking-widest text-rose-gold-light">Our Promise</p>
              <p className="mt-1 text-sm font-semibold">Beauty crafted with care</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="A sanctuary for beauty and self-care"
              subtitle="Meera's - The Beauty Saga is a premium beauty salon offering hair, makeup, bridal and skin care services. Our space is designed around you, with specialists who take time to understand your look and your goals."
            />
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                From everyday styling to once-in-a-lifetime bridal transformations, our team blends
                technical skill with a personal touch. We believe great beauty is not about trends, it
                is about what makes you feel confident and comfortable.
              </p>
              <p>
                Every service at Meera&rsquo;s is delivered in a calm, welcoming environment with
                attention to hygiene, comfort and detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pattern-pink py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Mission &amp; Values"
            subtitle="We aim to deliver premium, personalised beauty experiences that are consistent, honest and caring."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card card-hover flex h-full flex-col gap-3 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="The Team"
            title="Meet Our Specialists"
            subtitle="Our professionals bring experience and care to every appointment."
          />
          {team.length === 0 ? (
            <Reveal className="mt-10 text-center text-muted">
              Team profiles will appear here once added by the owner.
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                      {t.bio && <p className="mt-2 line-clamp-3 text-xs text-muted">{t.bio}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pattern-surface py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="Visit Us"
            title="Find Meera's"
            subtitle="We would love to welcome you. Reach out or drop by during opening hours."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "Address", text: BRAND.contact.address },
              { title: "Phone / WhatsApp", text: `${BRAND.contact.phone} · ${BRAND.contact.whatsapp}` },
              { title: "Opening Hours", text: BRAND.contact.hours },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="card card-hover h-full p-6">
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link href="/services" className="btn-primary">
              Explore our services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
