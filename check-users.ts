import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true }
  });
  console.log("=== USERS ===");
  for (const u of users) {
    console.log(`- [${u.email}] role=${u.role} active=${u.isActive} id=${u.id}`);
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
