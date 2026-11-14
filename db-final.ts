import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const b = await prisma.booking.count();
  const t = await prisma.testimonial.count();
  const tp = await prisma.teamProfile.count();
  console.log("Bookings:", b, "| Testimonials:", t, "| TeamProfiles:", tp);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
