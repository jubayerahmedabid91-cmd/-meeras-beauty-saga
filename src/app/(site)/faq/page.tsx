import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getFAQs } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about booking, services, pricing and policies at Meera's - The Beauty Saga.",
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Answers to the questions we hear most often. Can't find what you need? Contact us directly."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/faq", label: "FAQ" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site mx-auto max-w-3xl">
          {faqs.length === 0 ? (
            <Reveal className="text-center text-muted">FAQs will appear here once added by the owner.</Reveal>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Reveal key={faq.id} delay={i * 0.03}>
                  <details className="card group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                      {faq.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-rose-gold transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-10 text-center">
            <p className="text-sm text-muted">Still have a question?</p>
            <Link href="/contact" className="btn-primary mt-3">
              Contact us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
