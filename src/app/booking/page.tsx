import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getServices, getPackages } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book your appointment at Meera's - The Beauty Saga online.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string }>;
}) {
  const { service: preselectedService, package: preselectedPackage } = await searchParams;
  const [services, packages, staff] = await Promise.all([
    getServices(),
    getPackages(),
    prisma.staff.findMany({ where: { isActive: true }, include: { user: true } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Online Booking"
        title="Book Your Appointment"
        subtitle="Choose your service, pick a time and confirm. It takes less than a minute."
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/booking", label: "Booking" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site">
          <BookingWizard
            services={services.map((s) => ({
              id: s.id,
              slug: s.slug,
              name: s.name,
              durationMin: s.durationMin,
              priceCents: s.priceCents,
              categoryName: s.category.name,
            }))}
            packages={packages.map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              durationMin: p.durationMin,
              priceCents: p.priceCents - p.discountCents,
            }))}
            staff={staff.map((s) => ({
              id: s.id,
              name: `${s.firstName} ${s.lastName}`,
              jobTitle: s.jobTitle,
            }))}
            preselectedService={preselectedService}
            preselectedPackage={preselectedPackage}
          />
        </div>
      </section>
    </>
  );
}
