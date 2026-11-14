import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";

export function ContactCta() {
  return (
    <section className="pattern-pink py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Visit Us"
          title="Book your appointment"
          subtitle="Reach out to us or walk in during opening hours. We would love to welcome you."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal>
            <Link href="/contact" className="card card-hover flex h-full flex-col gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold">Our Address</h3>
              <p className="text-sm text-muted">{BRAND.contact.address}</p>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/contact" className="card card-hover flex h-full flex-col gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                <Phone className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold">Call / WhatsApp</h3>
              <p className="text-sm text-muted">{BRAND.contact.phone}</p>
              <p className="text-sm text-muted">{BRAND.contact.whatsapp}</p>
            </Link>
          </Reveal>
          <Reveal delay={0.16}>
            <Link href="/contact" className="card card-hover flex h-full flex-col gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                <Clock className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold">Opening Hours</h3>
              <p className="text-sm text-muted">{BRAND.contact.hours}</p>
              <p className="text-xs text-muted">
                <Mail className="mr-1 inline h-3.5 w-3.5" />
                {BRAND.contact.email}
              </p>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-10 text-center">
          <Link href="/booking" className="btn-primary !px-8 !py-4">
            Book now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
