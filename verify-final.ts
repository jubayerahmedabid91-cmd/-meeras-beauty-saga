import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const [b, t, c, u] = await Promise.all([
    prisma.booking.count(),
    prisma.testimonial.count(),
    prisma.teamProfile.count(),
    prisma.user.count()
  ]);
  console.log("Bookings:", b);
  console.log("Testimonials:", t);
  console.log("TeamProfiles:", c);
  console.log("Users:", u);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
