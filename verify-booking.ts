import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const booking = await prisma.booking.findFirst({
    where: { bookingNumber: "MB-G8LKYEQQUZ" },
    include: { customer: true, service: true }
  });
  console.log("Booking:", JSON.stringify(booking, null, 2));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
