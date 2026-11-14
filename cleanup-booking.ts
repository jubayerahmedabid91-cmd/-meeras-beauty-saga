import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const deleted = await prisma.booking.deleteMany({
    where: { bookingNumber: { startsWith: "MB-" } }
  });
  console.log("Bookings deleted:", deleted.count);
  const bookings = await prisma.booking.findMany({ where: { bookingNumber: { startsWith: "MB-" } } });
  for (const b of bookings) {
    await prisma.customer.delete({ where: { id: b.customerId } });
  }
  console.log("Customers deleted for test bookings");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
