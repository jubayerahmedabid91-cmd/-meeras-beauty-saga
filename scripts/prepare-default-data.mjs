/**
 * Generates src/lib/default-data.ts from the live database.
 *
 * Why: if the database is ever unreachable at runtime, the data layer falls
 * back to this built-in content so the site still renders fully instead of
 * showing empty sections.
 *
 * The generated file is committed, so a build without database access still
 * ships usable fallback content.
 *
 * Run automatically as part of `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";

// Load .env the same way the app does.
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.DATABASE_URL ?? "";
const output = path.join(process.cwd(), "src", "lib", "default-data.ts");

if (!url.startsWith("postgres")) {
  console.warn("[default-data] DATABASE_URL is not PostgreSQL - keeping committed defaults.");
  process.exit(0);
}

const { PrismaPg } = await import("@prisma/adapter-pg");
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const rows = (items) => items.map((row) => {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString() : value;
  }
  return out;
});

const [
  services,
  packages,
  gallery,
  testimonials,
  team,
  faqs,
  categories,
  settings,
] = await Promise.all([
  prisma.service.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, include: { category: true } }),
  prisma.package.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
  prisma.galleryImage.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
  prisma.testimonial.findMany({ where: { isVisible: true }, orderBy: { createdAt: "desc" }, take: 6 }),
  prisma.teamProfile.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
  prisma.fAQ.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
  prisma.serviceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  prisma.businessSetting.findMany(),
]);

await prisma.$disconnect();

const payload = {
  DEFAULT_SERVICES: rows(services),
  DEFAULT_PACKAGES: rows(packages),
  DEFAULT_GALLERY: rows(gallery),
  DEFAULT_TESTIMONIALS: rows(testimonials),
  DEFAULT_TEAM: rows(team),
  DEFAULT_FAQS: rows(faqs),
  DEFAULT_CATEGORIES: rows(categories),
  DEFAULT_SETTINGS: Object.fromEntries(settings.map((s) => [s.key, s.value])),
};

const body = `/**
 * AUTO-GENERATED from the database by scripts/prepare-default-data.mjs.
 * Fallback content used when the database is unreachable at runtime.
 * Do not edit by hand.
 */

${Object.entries(payload)
  .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
  .join("\n\n")}
`;

fs.writeFileSync(output, body);
console.log(
  `[default-data] wrote src/lib/default-data.ts ` +
    `(services=${payload.DEFAULT_SERVICES.length}, packages=${payload.DEFAULT_PACKAGES.length}, ` +
    `gallery=${payload.DEFAULT_GALLERY.length}, faqs=${payload.DEFAULT_FAQS.length})`
);
