import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "mrjynox22@gmail.com";

  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("User exists:", existing.id, existing.email, existing.role);
    // Update password
    const hash = await bcrypt.hash("Meeras@2026#Admin", 12);
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash: hash, role: "ADMIN" },
    });
    console.log("Password updated for:", updated.id);

    // Also update staff profile if exists
    const staff = await prisma.staff.findUnique({ where: { userId: existing.id } });
    if (staff) {
      console.log("Staff profile exists:", staff.id);
      // Update staff name
      await prisma.staff.update({
        where: { id: staff.id },
        data: { firstName: "Mr", lastName: "Jynox", jobTitle: "Super Admin" },
      });
      console.log("Staff profile updated");
    }
  } else {
    const hash = await bcrypt.hash("Meeras@2026#Admin", 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        role: "ADMIN",
        staff: {
          create: {
            firstName: "Mr",
            lastName: "Jynox",
            jobTitle: "Super Admin",
          },
        },
      },
    });
    console.log("Super admin created:", user.id, user.email);
  }

  await prisma.$disconnect();
}

main()
  .then(() => console.log("Done"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
