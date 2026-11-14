import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export function BridalPreview() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-16 text-white md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(232,196,203,0.25) 0 1px, transparent 1px 100px)",
        }}
      />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="eyebrow !text-rose-gold-light">Bridal Services</span>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Your most memorable day, beautifully styled
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
              From engagement to the wedding day, our bridal team creates a complete look
              tailored to you - makeup, hair, draping and finishing touches. Every detail is
              planned in advance so you can relax and shine.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-4">
            <Link href="/bridal" className="btn-primary">
              Explore bridal services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/packages" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">
              View bridal packages
            </Link>
          </Reveal>
        </div>

        <Reveal className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/assets/web/bridal/image_b00600e3.jpg"
              alt="Red bridal lehenga look"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:mt-8">
            <Image
              src="/assets/web/bridal/image_c2c6b202.jpg"
              alt="Bridal portrait with maang tikka"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
