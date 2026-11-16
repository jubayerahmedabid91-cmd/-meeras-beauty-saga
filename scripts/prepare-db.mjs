/**
 * Prepares the PostgreSQL database during a build.
 *
 * Runs only when DATABASE_URL points at PostgreSQL (i.e. on Netlify, where the
 * environment variables are set). Safe to run on every deploy:
 *  - `prisma db push` is a no-op when the schema already matches
 *  - the seed upserts users and only creates content when the tables are empty
 *
 * Skipped entirely on local SQLite-style setups and when no DATABASE_URL is set.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgres")) {
  console.log("[prepare-db] skipping (DATABASE_URL is not PostgreSQL)");
  process.exit(0);
}

try {
  console.log("[prepare-db] applying migrations…");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log("[prepare-db] seeding…");
  execSync("npx prisma db seed", { stdio: "inherit" });
  console.log("[prepare-db] done");
} catch (error) {
  console.error("[prepare-db] failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
