/**
 * One-time data migration: marks the six seeded testimonials as SAMPLE source
 * so they are never displayed to the public as verified customer reviews.
 * Owner-curated testimonials (source = OWNER) remain public.
 */
import fs from "node:fs";
import pg from "pg";

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  // Only flag rows that still look like the seeded demo set (created by the
  // seed within the same second batch), so owner-curated rows are never touched.
  const { rows } = await pool.query(
    `UPDATE testimonials
        SET source = 'SAMPLE'
      WHERE source = 'OWNER'
        AND name IN ('Farhana M.','Nusrat J.','Tanvir A.','Sadia K.','Mehedi H.','Ananya R.')
      RETURNING name`,
  );
  console.log(`Flagged ${rows.length} seeded testimonial(s) as SAMPLE:`, rows.map((r) => r.name));

  const verify = await pool.query(`SELECT source, COUNT(*)::int AS n FROM testimonials GROUP BY 1`);
  console.log("Testimonials by source:", verify.rows);
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
