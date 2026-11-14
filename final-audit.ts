import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== FINAL AUDIT SUMMARY ===");
  console.log("");

  console.log("1. USERS:");
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, isActive: true } });
  for (const u of users) {
    console.log(`   [${u.role}] ${u.email} (active: ${u.isActive})`);
  }
  console.log("");

  console.log("2. TEAM PROFILES:");
  const team = await prisma.teamProfile.findMany({
    select: { id: true, name: true, role: true, isVisible: true }
  });
  if (team.length === 0) {
    console.log("   (empty - admin-managed, awaiting owner content)");
  } else {
    for (const t of team) {
      console.log(`   - [${t.name || "N/A"}] ${t.role} (visible: ${t.isVisible})`);
    }
  }
  console.log("");

  console.log("3. TESTIMONIALS:");
  const testimonials = await prisma.testimonial.findMany({
    select: { id: true, name: true, rating: true, isVisible: true }
  });
  if (testimonials.length === 0) {
    console.log("   (empty - admin-managed, awaiting owner content)");
  } else {
    for (const t of testimonials) {
      console.log(`   - [${t.name || "N/A"}] ${t.rating}★ (visible: ${t.isVisible})`);
    }
  }
  console.log("");

  console.log("4. CONTACT MESSAGES:");
  const contact = await prisma.contactMessage.findMany({ select: { id: true, name: true } });
  if (contact.length === 0) {
    console.log("   (empty - admin-managed, awaiting owner content)");
  } else {
    for (const c of contact) {
      console.log(`   - [${c.id}] ${c.name}`);
    }
  }
  console.log("");

  console.log("5. BOOKING COUNT: " + (await prisma.booking.count()));
  console.log("6. TOTAL CUSTOMERS: " + (await prisma.customer.count()));
  console.log("7. TOTAL SERVICES: " + (await prisma.service.count()));
  console.log("8. TOTAL PACKAGES: " + (await prisma.package.count()));
  console.log("");

  console.log("=== PAGE AUDIT (HTTP Status) ===");
  const pages = [
    "/", "/about", "/services", "/services/signature-cut", "/packages", "/packages/bridal-radiance",
    "/bridal", "/gallery", "/gallery/before-after", "/contact", "/faq", "/booking",
    "/privacy-policy", "/terms-and-conditions", "/team", "/reviews", "/offers"
  ];
  for (const p of pages) {
    const res = await fetch(`http://127.0.0.1:3000${p}`);
    console.log(`   ${p.padEnd(25)} ${res.status}`);
  }
  console.log("");
  console.log("=== CUSTOMER PORTAL (with session) ===");
  const customerPages = ["/customer", "/customer/bookings", "/customer/profile", "/customer/settings"];
  for (const p of customerPages) {
    const res = await fetch(`http://127.0.0.1:3000${p}`, { headers: { Cookie: "next-auth.session-token=proxy" } });
    console.log(`   ${p.padEnd(25)} ${res.status}`);
  }
  console.log("");
  console.log("=== STAFF PORTAL (with session) ===");
  const staffPages = ["/staff", "/staff/appointments", "/staff/schedule"];
  for (const p of staffPages) {
    const res = await fetch(`http://127.0.0.1:3000${p}`, { headers: { Cookie: "next-auth.session-token=proxy" } });
    console.log(`   ${p.padEnd(20)} ${res.status}`);
  }
  console.log("");
  console.log("=== ADMIN PANEL (with session) ===");
  const adminPages = [
    "/admin", "/admin/bookings", "/admin/services", "/admin/packages",
    "/admin/customers", "/admin/staff", "/admin/settings", "/admin/settings/business-hours",
    "/admin/roles", "/admin/notifications", "/admin/calendar", "/admin/website/team",
    "/admin/website/testimonials", "/admin/website/faq", "/admin/website/gallery",
    "/admin/website/contact", "/admin/website/about", "/admin/website/seo"
  ];
  for (const p of adminPages) {
    const res = await fetch(`http://127.0.0.1:3000${p}`, { headers: { Cookie: "next-auth.session-token=proxy" } });
    console.log(`   ${p.padEnd(35)} ${res.status}`);
  }
  console.log("");
  console.log("=== BOOKING API TEST ===");
  const res = await fetch("http://127.0.0.1:3000/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "service", serviceSlug: "signature-cut",
      date: "2027-01-15", time: "10:00",
      customer: { name: "Audit Test", email: "audit@test.com", phone: "01700000000" }
    })
  });
  const result = await res.json();
  console.log(`   HTTP: ${res.status} | Response: ${JSON.stringify(result).substring(0, 100)}`);
  console.log("");

  // Cleanup test booking
  const testBooking = await prisma.booking.findFirst({ where: { bookingNumber: { startsWith: "MB-" } } });
  if (testBooking) {
    const cust = await prisma.customer.findUnique({ where: { id: testBooking.customerId } });
    if (cust) {
      await prisma.user.delete({ where: { id: cust.userId } });
      await prisma.customer.delete({ where: { id: cust.id } });
      await prisma.booking.delete({ where: { id: testBooking.id } });
      console.log("Test booking cleaned up.");
    }
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
