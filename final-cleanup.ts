import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
async function main() {
  // Delete test team profile
  const team = await prisma.teamProfile.deleteMany({
    where: { name: "Test" }
  });
  console.log("Team profiles deleted:", team.count);

  // Delete test testimonial
  const testimonial = await prisma.testimonial.deleteMany({
    where: { name: "Test" }
  });
  console.log("Testimonials deleted:", testimonial.count);

  // Verify remaining
  const remainingTeam = await prisma.teamProfile.count();
  const remainingTestimonials = await prisma.testimonial.count();
  console.log("Remaining team profiles:", remainingTeam);
  console.log("Remaining testimonials:", remainingTestimonials);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
