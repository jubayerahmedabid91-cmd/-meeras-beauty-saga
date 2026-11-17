/**
 * Deletes the two Neon test bookings ("Neon Test 1" and "Neon Test 2") from
 * the production PostgreSQL database, plus their test customer records.
 *
 * Order matters: bookings are deleted by exact ID first, then the customers
 * (Booking.customer has no cascade, while Payment/BookingItem/BookingStaff/
 * BookingStaff assignment all cascade from Booking).
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

const TARGET_BOOKING_IDS = ["cmwjaq7690002ggv9l79gmiz9", "cmwjaqa820006ggv9k7ztdsy3"];
const TARGET_BOOKING_NUMBERS = ["MB-JAQ6Z476IN", "MB-JAQA0ZJUUG"];
const TARGET_CUSTOMER_NAMES = ["Neon Test 1", "Neon Test 2"];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const before = await pool.query(
    `SELECT c.first_name || ' ' || c.last_name AS name, COUNT(*)::int AS bookings
       FROM bookings b JOIN customers c ON c.id = b.customer_id
      WHERE c.first_name || ' ' || c.last_name = ANY($1)
      GROUP BY 1`,
    [TARGET_CUSTOMER_NAMES],
  );
  console.log("Before:", before.rows);

  // 1. Delete the bookings (relations cascade: payment, items, assignment, staff link).
  const delBookings = await pool.query(
    `DELETE FROM bookings
      WHERE id = ANY($1)
        AND booking_number = ANY($2)
        AND customer_id IN (SELECT id FROM customers WHERE first_name || ' ' || last_name = ANY($3))
      RETURNING booking_number`,
    [TARGET_BOOKING_IDS, TARGET_BOOKING_NUMBERS, TARGET_CUSTOMER_NAMES],
  );
  console.log(`Deleted ${delBookings.rowCount} booking(s):`, delBookings.rows.map((r) => r.booking_number));

  // 2. Delete the leftover test customers (no bookings remain to block the delete).
  const delCustomers = await pool.query(
    `DELETE FROM customers WHERE first_name || ' ' || last_name = ANY($1) RETURNING first_name, last_name`,
    [TARGET_CUSTOMER_NAMES],
  );
  console.log(`Deleted ${delCustomers.rowCount} customer(s):`, delCustomers.rows.map((r) => `${r.first_name} ${r.last_name}`));

  // 3. Verify nothing is left.
  const verify = await pool.query(
    `SELECT COUNT(*)::int AS remaining
       FROM bookings b JOIN customers c ON c.id = b.customer_id
      WHERE c.first_name ILIKE '%neon test%' OR b.booking_number = ANY($1)`,
    [TARGET_BOOKING_NUMBERS],
  );
  console.log(`Verification — remaining test bookings: ${verify.rows[0].remaining}`);

  if (verify.rows[0].remaining !== 0) {
    throw new Error("Verification failed — test bookings still present.");
  }
  console.log("SUCCESS: Neon Test 1 and Neon Test 2 bookings removed.");
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
