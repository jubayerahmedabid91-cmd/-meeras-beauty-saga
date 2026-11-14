import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "owner@meerasdemo.com" } });
  if (existing) {
    console.log("Owner user already exists:", existing.id);
  } else {
    const hash = await bcrypt.hash("Owner@12345", 12);
    const created = await prisma.user.create({
      data: {
        email: "owner@meerasdemo.com",
        passwordHash: hash,
        role: "OWNER",
        isActive: true,
      },
    });
    console.log("Owner user created:", created.id);
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
