-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_favourites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "service_id" TEXT,
    "package_id" TEXT,
    CONSTRAINT "favourites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favourites_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favourites_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_favourites" ("customer_id", "id", "package_id", "service_id") SELECT "customer_id", "id", "package_id", "service_id" FROM "favourites";
DROP TABLE "favourites";
ALTER TABLE "new_favourites" RENAME TO "favourites";
CREATE UNIQUE INDEX "favourites_customer_id_service_id_package_id_key" ON "favourites"("customer_id", "service_id", "package_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
