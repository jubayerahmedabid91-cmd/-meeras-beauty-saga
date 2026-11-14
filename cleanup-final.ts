import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const email = "test@test.com";
  const customers = await prisma.customer.findMany({ where: { userId: { startsWith: "cmwex4" } } });
  // Check by user id pattern
  const u = await prisma.user.findFirst({ where: { email, isActive: true } });
  if (u) {
    await prisma.user.delete({ where: { id: u.id } });
    console.log("Deleted user:", u.email);
  }
  const c = await prisma.customer.findFirst({ where: { userId: { startsWith: "cmwex4" } } });
  if (c) {
    const uid = c.userId;
    await prisma.customer.delete({ where: { id: c.id } });
    await prisma.user.delete({ where: { id: uid } });
    console.log("Deleted customer:", c.id, "user:", uid);
  }
  const bookings = await prisma.booking.findMany({
    where: { customer: { userId: { startsWith: "cmwex4" } } },
    select: { id: true, bookingNumber: true }
  });
  for (const b of bookings) {
    await prisma.booking.delete({ where: { id: b.id } });
    console.log("Deleted booking:", b.bookingNumber);
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
