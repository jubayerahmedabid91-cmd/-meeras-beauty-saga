import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { prisma, safeQuery } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Meera's - The Beauty Saga services and website.",
};

export default async function TermsPage() {
  const content = await safeQuery(
    () =>
      prisma.websiteContent.findUnique({
        where: { page_section_key: { page: "terms", section: "main", key: "content" } },
      }),
    null
  );

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms &amp; Conditions"
        subtitle="The terms that govern your use of our website and services."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/terms-and-conditions", label: "Terms & Conditions" }]}
      />
      <section className="bg-white py-12 md:py-16">
        <div className="container-site mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-charcoal">
          {content?.value ? (
            <div className="whitespace-pre-line">{content.value}</div>
          ) : (
            <>
              <p>
                By using the Meera&rsquo;s - The Beauty Saga website and services, you agree to the
                following terms and conditions.
              </p>
              <h2 className="text-xl font-bold">1. Bookings &amp; Appointments</h2>
              <p>
                All bookings are subject to availability and confirmation. Please arrive on time for your
                appointment. Late arrival may result in a shortened service.
              </p>
              <h2 className="text-xl font-bold">2. Cancellations &amp; Rescheduling</h2>
              <p>
                Cancellations and rescheduling must be made within the notice period stated at the time
                of booking. Late cancellations may be subject to a fee.
              </p>
              <h2 className="text-xl font-bold">3. Pricing &amp; Payment</h2>
              <p>
                Prices are indicative and may vary based on consultation and service requirements. Payment
                is due at the time of service unless otherwise agreed.
              </p>
              <h2 className="text-xl font-bold">4. Use of Website</h2>
              <p>
                You agree not to misuse our website or attempt to access it using unauthorised methods.
                Content on this website is the property of Meera&rsquo;s - The Beauty Saga.
              </p>
              <h2 className="text-xl font-bold">5. Liability</h2>
              <p>
                While we take every care, we are not liable for allergic reactions or adverse effects.
                Please inform us of any allergies or sensitivities before your service.
              </p>
              <h2 className="text-xl font-bold">6. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of our services constitutes
                acceptance of the updated terms.
              </p>
              <p className="text-xs text-muted">
                This is a template terms document. The business owner should review and update it with
                their legal advisor before publication.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
