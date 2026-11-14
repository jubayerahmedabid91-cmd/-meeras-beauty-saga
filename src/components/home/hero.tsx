import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Calendar, Star } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <section className="pattern-surface relative overflow-hidden">
      {/* decorative arches */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-rose-gold/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full border border-rose-gold/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-rose-gold/10"
      />

      <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10">
          <span className="eyebrow">Premium Beauty Salon</span>

          <h1
            className="mt-4 text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meera&rsquo;s
            <span className="mt-2 block text-2xl font-semibold uppercase tracking-[0.3em] text-rose-gold md:text-3xl">
              The Beauty Saga
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {BRAND.description} From bridal transformations to everyday radiance, our
            specialists craft every look with care and premium products.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/booking" className="btn-primary !px-8 !py-4 !text-base">
              <Calendar className="h-5 w-5" />
              Book Appointment
            </Link>
            <Link href="/services" className="btn-outline !px-8 !py-4 !text-base">
              Explore Services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-rose-gold text-rose-gold" />
              Premium products
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-gold" />
              Expert stylists
            </span>
            <span className="flex items-center gap-2">
              <LogoMark className="h-6 w-6" />
              Signature looks
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] max-w-lg overflow-hidden rounded-[2rem] bg-pastel-pink shadow-lift">
            <Image
              src="/assets/web/bridal/image_41c14ae9.jpg"
              alt="Bridal beauty look at Meera's - The Beauty Saga"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/90 p-4 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-widest text-rose-gold">Signature</p>
                <p className="text-sm font-bold text-charcoal">Bridal &amp; Occasion Looks</p>
              </div>
              <Link href="/bridal" className="btn-primary !px-4 !py-2 text-xs">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
