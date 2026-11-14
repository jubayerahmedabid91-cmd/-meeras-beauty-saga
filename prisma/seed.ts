/**
 * Demo seed for local development.
 *
 * IMPORTANT: every record created here is DEMO data, clearly labelled, and is
 * intended to be replaced/edited by the business owner from the admin panel.
 * No real prices, contact details, or business history are asserted.
 *
 * Run with:  npx prisma db seed
 */
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Demo@12345";
const DEMO_OWNER_PASSWORD = "Owner@12345";

async function main() {
  console.log("Seeding demo data...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const ownerHash = await bcrypt.hash(DEMO_OWNER_PASSWORD, 12);

  // ── Users ────────────────────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "owner@meerasdemo.com" },
    update: {},
    create: {
      email: "owner@meerasdemo.com",
      passwordHash: ownerHash,
      role: "OWNER",
      isActive: true,
      customer: {
        create: {
          firstName: "Owner",
          lastName: "(Demo)",
          loyaltyPoints: 0,
          referralCode: "OWNER-DEMO",
        },
      },
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: "staff@meerasdemo.com" },
    update: {},
    create: {
      email: "staff@meerasdemo.com",
      passwordHash,
      role: "STAFF",
      isActive: true,
      staff: {
        create: {
          firstName: "Demo",
          lastName: "Stylist",
          jobTitle: "Senior Stylist (Demo)",
          bio: "Demo profile - replace with real staff details.",
          commissionRate: 0,
        },
      },
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@meerasdemo.com" },
    update: {},
    create: {
      email: "customer@meerasdemo.com",
      passwordHash,
      role: "CUSTOMER",
      isActive: true,
      customer: {
        create: {
          firstName: "Demo",
          lastName: "Customer",
          loyaltyPoints: 250,
          referralCode: "DEMO-CUST-01",
        },
      },
    },
  });

  console.log("Users created:", { owner: owner.email, staff: staffUser.email, customer: customerUser.email });

  // ── Service categories ───────────────────────────────────────────────────
  const categories = [
    { name: "Hair Styling", slug: "hair-styling", description: "Blow-dry, curls, updos and special-occasion styling.", sortOrder: 1 },
    { name: "Hair Cutting", slug: "hair-cutting", description: "Precision cuts, trims and restyling.", sortOrder: 2 },
    { name: "Hair Treatment", slug: "hair-treatment", description: "Keratin, spa, smoothening and repair treatments.", sortOrder: 3 },
    { name: "Hair Coloring", slug: "hair-coloring", description: "Global colour, highlights, balayage and root touch-ups.", sortOrder: 4 },
    { name: "Makeup", slug: "makeup", description: "Party, engagement and occasional makeup artistry.", sortOrder: 5 },
    { name: "Bridal Makeup", slug: "bridal-makeup", description: "Complete bridal looks for the wedding day and related events.", sortOrder: 6 },
    { name: "Skin Care", slug: "skin-care", description: "Facials, cleanup and skin treatments.", sortOrder: 7 },
    { name: "Facial & Beauty", slug: "facial-beauty", description: "Advanced facial and beauty therapies.", sortOrder: 8 },
  ];

  for (const c of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  const cat = (slug: string) => prisma.serviceCategory.findUniqueOrThrow({ where: { slug } });

  // ── Services (demo prices - owner must review) ───────────────────────────
  const services = [
    { category: "hair-styling", name: "Blow-Dry Styling", slug: "blow-dry-styling", description: "Professional wash and blow-dry finish.", durationMin: 45, priceCents: 1200, isFeatured: true, image: "/assets/web/hair/image_8fbc425b.jpg" },
    { category: "hair-styling", name: "Party Hairstyle", slug: "party-hairstyle", description: "Elegant party styling with lasting hold.", durationMin: 60, priceCents: 2500, image: "/assets/web/hair/image_c48777e4.jpg" },
    { category: "hair-cutting", name: "Signature Cut", slug: "signature-cut", description: "Consultation and precision cut by senior stylists.", durationMin: 45, priceCents: 1800, isFeatured: true, image: "/assets/web/hair/image_c89013cb.jpg" },
    { category: "hair-treatment", name: "Keratin Treatment", slug: "keratin-treatment", description: "Smoothing keratin therapy for frizz control.", durationMin: 120, priceCents: 8500, image: "/assets/web/hair/image_c21e3531.jpg" },
    { category: "hair-coloring", name: "Global Colour", slug: "global-colour", description: "Full-head colour with premium products.", durationMin: 120, priceCents: 6000, isFeatured: true, image: "/assets/web/hair/image_e21b9ea3.jpg" },
    { category: "makeup", name: "Party Makeup", slug: "party-makeup", description: "Glam party makeup with lashes and touch-up kit.", durationMin: 60, priceCents: 4000, isFeatured: true, image: "/assets/web/makeup/image_78757ed1.jpg" },
    { category: "bridal-makeup", name: "Bridal Makeup Package", slug: "bridal-makeup-package", description: "Complete bridal look with HD or airbrush finish.", durationMin: 180, priceCents: 15000, isFeatured: true, image: "/assets/web/bridal/image_b00600e3.jpg" },
    { category: "skin-care", name: "Signature Facial", slug: "signature-facial", description: "Deep-cleansing facial tailored to your skin.", durationMin: 60, priceCents: 3500, image: "/assets/web/makeup/image_95d850bf.jpg" },
    { category: "facial-beauty", name: "Advanced Facial Ritual", slug: "advanced-facial-ritual", description: "Premium facial with brightening and lifting care.", durationMin: 75, priceCents: 5500, image: "/assets/web/makeup/image_daf20795.jpg" },
  ];

  for (const s of services) {
    const category = await cat(s.category);
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        categoryId: category.id,
        name: s.name,
        description: s.description,
        durationMin: s.durationMin,
        priceCents: s.priceCents,
        isFeatured: s.isFeatured ?? false,
        imageUrl: s.image,
      },
      create: {
        categoryId: category.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        durationMin: s.durationMin,
        priceCents: s.priceCents,
        isFeatured: s.isFeatured ?? false,
        imageUrl: s.image,
      },
    });
  }

  // ── Packages (demo prices - owner must review) ───────────────────────────
  const packages = [
    { name: "Bridal Radiance", slug: "bridal-radiance", category: "BRIDAL", description: "Complete bridal experience: HD makeup, hairstyling, draping and saree styling.", priceCents: 25000, discountCents: 2000, durationMin: 240, isFeatured: true, image: "/assets/web/bridal/image_afb770d5.jpg" },
    { name: "Engagement Glow", slug: "engagement-glow", category: "OCCASION", description: "Party makeup, hairstyling and photoshoot-ready finishing.", priceCents: 8000, discountCents: 0, durationMin: 120, image: "/assets/web/makeup/image_8e64af26.jpg" },
    { name: "Hair Reborn", slug: "hair-reborn", category: "HAIR", description: "Keratin treatment, cut and styling for a complete transformation.", priceCents: 12000, discountCents: 1000, durationMin: 180, isFeatured: true, image: "/assets/web/hair/image_5be87d02.jpg" },
    { name: "Glow & Go", slug: "glow-and-go", category: "SKIN", description: "Signature facial plus express manicure and pedicure.", priceCents: 6500, discountCents: 500, durationMin: 90, image: "/assets/web/makeup/image_2586dd22.jpg" },
    { name: "Festival Spark", slug: "festival-spark", category: "FESTIVAL", description: "Seasonal makeup and hairstyle bundle for festive occasions.", priceCents: 7000, discountCents: 0, durationMin: 120, image: "/assets/web/bridal/image_d26a8d80.jpg" },
    { name: "Bridal + Groom Combo", slug: "bridal-groom-combo", category: "COMBO", description: "Coordinated bridal and groom looks for the big day.", priceCents: 35000, discountCents: 3000, durationMin: 300, isFeatured: true, image: "/assets/web/bridal/image_c2c6b202.jpg" },
  ];

  for (const p of packages) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        description: p.description,
        priceCents: p.priceCents,
        discountCents: p.discountCents,
        durationMin: p.durationMin,
        isFeatured: p.isFeatured ?? false,
        imageUrl: p.image,
      },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        priceCents: p.priceCents,
        discountCents: p.discountCents,
        durationMin: p.durationMin,
        isFeatured: p.isFeatured ?? false,
        imageUrl: p.image,
        validityDays: 180,
        terms: "Advance booking required. Demo package terms - owner to replace.",
      },
    });
  }

  // ── Business settings ────────────────────────────────────────────────────
  const settings: Record<string, unknown> = {
    salon_name: "Meera's",
    salon_subtitle: "THE BEAUTY SAGA",
    address: "To be provided by the owner",
    phone: "To be provided by the owner",
    whatsapp: "To be provided by the owner",
    email: "hello@meerasbeautysaga.com",
    currency: "USD",
    timezone: "Asia/Dhaka",
    language: "en",
    opening_hours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: { open: "10:00", close: "20:00" },
    },
    booking: {
      bufferMin: 15,
      minAdvanceHours: 2,
      maxAdvanceDays: 60,
      cancellationHours: 12,
    },
    social: { instagram: "", facebook: "", youtube: "", tiktok: "" },
    seo: {
      title: "Meera's - The Beauty Saga | Premium Beauty Salon",
      description: "Premium beauty salon offering hair, makeup, bridal and skin care services.",
      keywords: "beauty salon, bridal makeup, hair styling, facial",
    },
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.businessSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value), label: key },
    });
  }

  // ── Gallery (actual brand photos) ────────────────────────────────────────
  const gallery = [
    { src: "/assets/web/bridal/image_41c14ae9.jpg", alt: "Bridal lehenga look", category: "bridal" },
    { src: "/assets/web/makeup/image_78757ed1.jpg", alt: "Editorial blue eyeshadow makeup", category: "makeup" },
    { src: "/assets/web/hair/image_5be87d02.jpg", alt: "Hair styling transformation", category: "hair", beforeSrc: "/assets/web/hair/image_5be87d02.jpg", afterSrc: "/assets/web/hair/image_5be87d02.jpg" },
    { src: "/assets/web/fashion/image_16b097bf.jpg", alt: "Fashion portrait", category: "fashion" },
    { src: "/assets/web/bridal/image_b00600e3.jpg", alt: "Red bridal lehenga", category: "bridal" },
    { src: "/assets/web/makeup/image_95d850bf.jpg", alt: "Beauty makeup portrait", category: "makeup" },
    { src: "/assets/web/hair/image_c89013cb.jpg", alt: "Side-parted bob hairstyle", category: "hair" },
    { src: "/assets/web/bridal/image_c2c6b202.jpg", alt: "Bridal portrait with maang tikka", category: "bridal" },
    { src: "/assets/web/makeup/image_daf20795.jpg", alt: "Purple-blue eyeshadow close-up", category: "makeup" },
    { src: "/assets/web/fashion/image_ccc3b20.jpg", alt: "Fashion editorial", category: "fashion" },
  ];

  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i];
    await prisma.galleryImage.create({
      data: {
        src: g.src,
        alt: g.alt,
        category: g.category,
        beforeSrc: (g as { beforeSrc?: string }).beforeSrc ?? null,
        afterSrc: (g as { afterSrc?: string }).afterSrc ?? null,
        sortOrder: i,
      },
    });
  }

  // ── FAQs ─────────────────────────────────────────────────────────────────
  const faqs = [
    { q: "How do I book an appointment?", a: "You can book online through our booking page, or contact us by phone or WhatsApp. Our team will confirm your slot.", sortOrder: 1 },
    { q: "Can I reschedule or cancel my booking?", a: "Yes. You can reschedule or cancel from your customer portal, subject to our cancellation policy.", sortOrder: 2 },
    { q: "Do you offer bridal packages?", a: "Yes, we offer complete bridal packages. Visit our Bridal Services page for details.", sortOrder: 3 },
    { q: "What payment methods do you accept?", a: "We accept cash and card payments at the salon. Online payments will be available once a payment provider is configured.", sortOrder: 4 },
    { q: "Are your staff certified?", a: "Our team profiles list each professional's role. Specific qualifications are displayed on their profiles where provided by the owner.", sortOrder: 5 },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({
      data: { question: f.q, answer: f.a, sortOrder: f.sortOrder },
    });
  }

  // ── Demo testimonials (clearly labelled) ─────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { name: "Demo Client A", rating: 5, comment: "Demo testimonial - replace with real client feedback.", isVisible: true },
      { name: "Demo Client B", rating: 5, comment: "Demo testimonial - replace with real client feedback.", isVisible: true },
      { name: "Demo Client C", rating: 4, comment: "Demo testimonial - replace with real client feedback.", isVisible: true },
    ],
  });

  // ── Memberships ──────────────────────────────────────────────────────────
  await prisma.membership.upsert({
    where: { tier: "GOLD" },
    update: {},
    create: { name: "Gold", tier: "GOLD", priceCents: 5000, discountPct: 10, benefits: JSON.stringify(["10% off services", "Priority booking", "Birthday treat"]) },
  });
  await prisma.membership.upsert({
    where: { tier: "PLATINUM" },
    update: {},
    create: { name: "Platinum", tier: "PLATINUM", priceCents: 12000, discountPct: 20, benefits: JSON.stringify(["20% off services", "Priority booking", "Birthday treat", "Exclusive offers"]) },
  });

  // ── Role permissions seed ────────────────────────────────────────────────
  const { ROLE_PERMISSIONS } = await import("../src/lib/permissions");
  for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
    for (const p of perms) {
      await prisma.rolePermission.upsert({
        where: { role_permission: { role, permission: p } } as never,
        update: {},
        create: { role, permission: p },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Login credentials (demo):");
  console.log("  Owner:    owner@meerasdemo.com / Owner@12345");
  console.log("  Staff:    staff@meerasdemo.com / Demo@12345");
  console.log("  Customer: customer@meerasdemo.com / Demo@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
