import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Award } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";

const VALUES = [
  {
    icon: Heart,
    title: "Personal Care",
    text: "Every service begins with understanding your style, skin and preferences.",
  },
  {
    icon: Shield,
    title: "Trusted Products",
    text: "We use premium, skin-safe products chosen for lasting, healthy results.",
  },
  {
    icon: Award,
    title: "Refined Craft",
    text: "Our specialists focus on detail, so every look feels polished and confident.",
  },
];

export function AboutPreview() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-pastel-pink shadow-card">
            <Image
              src="/assets/web/makeup/image_78757ed1.jpg"
              alt="Makeup artistry at Meera's - The Beauty Saga"
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
            eyebrow="About Meera's"
            title="A sanctuary for beauty and self-care"
            subtitle="Meera's - The Beauty Saga is a premium beauty salon dedicated to helping you look and feel your best. From hair and makeup to bridal artistry and skin care, our space is designed around you."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="flex flex-col gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pastel-pink text-rose-gold">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10">
            <Link href="/about" className="btn-primary">
              Discover our story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
