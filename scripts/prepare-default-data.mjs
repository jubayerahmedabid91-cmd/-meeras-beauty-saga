/**
 * Generates src/lib/default-data.ts from the local SQLite database.
 *
 * Why: on hosts where the database cannot be reached at runtime (Netlify
 * Functions — native SQLite addons cannot load there), the data layer falls
 * back to this built-in content so the site still renders fully instead of
 * showing empty sections.
 *
 * The generated file is committed, so builds without a local dev.db still
 * ship the default content.
 *
 * Run automatically as part of `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const root = process.cwd();
const source = path.join(root, "dev.db");
const output = path.join(root, "src", "lib", "default-data.ts");

if (!fs.existsSync(source)) {
  console.warn("[default-data] dev.db not found - keeping the committed defaults.");
  process.exit(0);
}

const db = new Database(source, { readonly: true, fileMustExist: true });

const camel = (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const iso = (value) => (value instanceof Date ? value.toISOString() : value);

function rows(sql) {
  return db.prepare(sql).all().map((row) => {
    const out = {};
    for (const [key, value] of Object.entries(row)) out[camel(key)] = iso(value);
    return out;
  });
}

const categories = new Map(
  rows("SELECT id, name FROM service_categories").map((c) => [c.id, c.name])
);

const services = rows(
  "SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC"
).map((s) => ({ ...s, category: { name: categories.get(s.categoryId) ?? "" } }));

const payload = {
  DEFAULT_SERVICES: services,
  DEFAULT_PACKAGES: rows("SELECT * FROM packages WHERE is_active = 1 ORDER BY created_at DESC"),
  DEFAULT_GALLERY: rows("SELECT * FROM gallery_images WHERE is_visible = 1 ORDER BY sort_order ASC"),
  DEFAULT_TESTIMONIALS: rows(
    "SELECT * FROM testimonials WHERE is_visible = 1 ORDER BY created_at DESC LIMIT 6"
  ),
  DEFAULT_TEAM: rows("SELECT * FROM team_profiles WHERE is_visible = 1 ORDER BY sort_order ASC"),
  DEFAULT_FAQS: rows("SELECT * FROM faqs WHERE is_visible = 1 ORDER BY sort_order ASC"),
  DEFAULT_CATEGORIES: rows(
    "SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order ASC"
  ),
  DEFAULT_SETTINGS: Object.fromEntries(
    rows("SELECT key, value FROM business_settings").map((r) => [r.key, r.value])
  ),
};

db.close();

const body = `/**
 * AUTO-GENERATED from the local SQLite database by scripts/prepare-default-data.mjs.
 * Fallback content used when the database is unreachable at runtime.
 * Do not edit by hand.
 */

${Object.entries(payload)
  .map(([name, value]) => `export const ${name} = ${JSON.stringify(value, null, 0)};`)
  .join("\n\n")}
`;

fs.writeFileSync(output, body);
console.log(
  `[default-data] wrote src/lib/default-data.ts ` +
    `(services=${payload.DEFAULT_SERVICES.length}, packages=${payload.DEFAULT_PACKAGES.length}, ` +
    `gallery=${payload.DEFAULT_GALLERY.length}, faqs=${payload.DEFAULT_FAQS.length})`
);
