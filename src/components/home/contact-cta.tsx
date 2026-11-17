import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { getSalonProfile } from "@/lib/salon";

export async function ContactCta() {
  const salon = await getSalonProfile();

  const cards = [
    {
      icon: MapPin,
      title: "Our Address",
      value: salon.address,
      href: salon.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}`
        : null,
    },
    {
      icon: Phone,
      title: "Call / WhatsApp",
      value: salon.phone || salon.whatsapp,
      href: salon.phone ? `tel:${salon.phone.replace(/\s/g, "")}` : null,
    },
    {
      icon: Clock,
      title: "Opening Hours",
      value: salon.openingHours,
      href: null,
    },
    {
      icon: Mail,
      title: "Email",
      value: salon.email,
      href: salon.email ? `mailto:${salon.email}` : null,
    },
  ].filter((card) => Boolean(card.value));

  return (
    <section className="pattern-pink py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Visit Us"
          title="Book your appointment"
          subtitle="Reach out to us or walk in during opening hours. We would love to welcome you."
        />
        {cards.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted">
            Our contact details will appear here once configured by the salon. To book, use the
            booking page — no account needed.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="card card-hover flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold">{card.title}</h3>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition hover:text-rose-gold"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted">{card.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

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
