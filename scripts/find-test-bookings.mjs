/**
 * Finds bookings whose customer looks like a test entry (Neon Test 1/2).
 * Read-only — prints matches so deletion can be verified before running.
 */
import { execSync } from "node:child_process";
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

const { rows } = await pool.query(
  `SELECT b.id, b.booking_number, b.status, b.starts_at,
          c.first_name, c.last_name
     FROM bookings b
     JOIN customers c ON c.id = b.customer_id
    WHERE c.first_name ILIKE '%neon%'
       OR c.last_name ILIKE '%neon%'
       OR c.first_name || ' ' || c.last_name ILIKE '%neon test%'
       OR b.booking_number ILIKE '%neon%'
    ORDER BY b.starts_at DESC`,
);

console.log(`Found ${rows.length} matching booking(s):`);
for (const r of rows) {
  console.log(
    `- ${r.booking_number} | customer: "${r.first_name} ${r.last_name}" | status: ${r.status} | id: ${r.id}`,
  );
}

await pool.end();
