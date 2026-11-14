-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_number" TEXT NOT NULL DEFAULT '',
    "customer_id" TEXT NOT NULL,
    "package_id" TEXT,
    "service_id" TEXT,
    "staff_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "subtotal_cents" INTEGER NOT NULL,
    "discount_cents" INTEGER NOT NULL DEFAULT 0,
    "total_cents" INTEGER NOT NULL,
    "notes" TEXT,
    "internal_notes" TEXT,
    "buffer_min" INTEGER NOT NULL DEFAULT 0,
    "booked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" DATETIME,
    "completed_at" DATETIME,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("booked_at", "booking_number", "buffer_min", "cancelled_at", "completed_at", "customer_id", "discount_cents", "duration_min", "ends_at", "id", "internal_notes", "notes", "package_id", "service_id", "staff_id", "starts_at", "status", "subtotal_cents", "total_cents", "updated_at") SELECT "booked_at", "booking_number", "buffer_min", "cancelled_at", "completed_at", "customer_id", "discount_cents", "duration_min", "ends_at", "id", "internal_notes", "notes", "package_id", "service_id", "staff_id", "starts_at", "status", "subtotal_cents", "total_cents", "updated_at" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_booking_number_key" ON "bookings"("booking_number");
CREATE INDEX "bookings_customer_id_idx" ON "bookings"("customer_id");
CREATE INDEX "bookings_staff_id_idx" ON "bookings"("staff_id");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "bookings_starts_at_idx" ON "bookings"("starts_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
