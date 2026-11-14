import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Meera's - The Beauty Saga.",
};

export default async function PrivacyPolicyPage() {
  const content = await prisma.websiteContent.findUnique({
    where: { page_section_key: { page: "privacy", section: "main", key: "content" } },
  });

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/privacy-policy", label: "Privacy Policy" }]}
      />
      <section className="bg-white py-12 md:py-16">
        <div className="container-site mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-charcoal">
          {content?.value ? (
            <div className="whitespace-pre-line">{content.value}</div>
          ) : (
            <>
              <p>
                Meera&rsquo;s - The Beauty Saga respects your privacy. This policy explains what personal
                information we collect, how we use it, and the choices you have.
              </p>
              <h2 className="text-xl font-bold">1. Information We Collect</h2>
              <p>
                We collect information you provide directly, such as your name, contact details, booking
                preferences and payment information, as well as data collected automatically when you use
                our website.
              </p>
              <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
              <p>
                We use your information to process bookings, manage appointments, improve our services,
                and communicate with you about your appointments and offers.
              </p>
              <h2 className="text-xl font-bold">3. Sharing of Information</h2>
              <p>
                We do not sell your personal information. We may share data with service providers who
                help us operate our business, subject to appropriate safeguards.
              </p>
              <h2 className="text-xl font-bold">4. Data Security</h2>
              <p>
                We implement reasonable technical and organisational measures to protect your personal
                information against unauthorised access, loss or misuse.
              </p>
              <h2 className="text-xl font-bold">5. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data, subject to
                applicable law. Contact us to exercise these rights.
              </p>
              <h2 className="text-xl font-bold">6. Contact Us</h2>
              <p>
                If you have questions about this policy, please contact us through the details on our
                Contact page.
              </p>
              <p className="text-xs text-muted">
                This is a template policy. The business owner should review and update it with their legal
                advisor before publication.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
