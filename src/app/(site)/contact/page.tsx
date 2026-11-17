import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { getSalonProfile } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Meera's - The Beauty Saga. Book appointments, ask questions or plan your visit.",
};

export default async function ContactPage() {
  const salon = await getSalonProfile();

  const contactItems = [
    { icon: MapPin, label: "Address", value: salon.address, href: salon.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}` : null },
    { icon: Phone, label: "Phone", value: salon.phone, href: salon.phone ? `tel:${salon.phone.replace(/\s/g, "")}` : null },
    { icon: MessageCircle, label: "WhatsApp", value: salon.whatsapp, href: salon.whatsapp ? `https://wa.me/${salon.whatsappDigits}` : null },
    { icon: Mail, label: "Email", value: salon.email, href: salon.email ? `mailto:${salon.email}` : null },
    { icon: Clock, label: "Opening Hours", value: salon.openingHours, href: null },
  ].filter((item) => Boolean(item.value));

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="We would love to hear from you. Reach out for bookings, questions or customised beauty plans."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">Reach us directly</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Call, message or visit us during opening hours. For appointments, online booking is the
              fastest option.
            </p>
            {contactItems.length === 0 ? (
              <div className="mt-8 rounded-xl bg-pastel-pink p-6 text-center text-sm text-muted">
                <p>Contact details will appear here once configured in the admin panel.</p>
                <p className="mt-2">Use the booking form for appointments in the meantime.</p>
              </div>
            ) : (
              <ul className="mt-8 space-y-5">
                {contactItems.map((item) => (
                  <li key={item.label} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-0.5 text-sm font-medium text-charcoal hover:text-rose-gold transition">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-charcoal">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Reveal className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="mt-2 text-sm text-muted">
                Fill in the form and we will get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}