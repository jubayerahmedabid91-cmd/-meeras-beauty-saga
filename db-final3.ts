import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const b = await prisma.booking.findFirst({ where: { bookingNumber: { startsWith: "MB-" } } });
  if (b) {
    await prisma.booking.delete({ where: { id: b.id } });
    console.log("Deleted test booking:", b.bookingNumber);
  }
  console.log("Remaining bookings:", await prisma.booking.count());
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
