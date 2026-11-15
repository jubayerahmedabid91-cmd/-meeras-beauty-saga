import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { DB_TEMPLATE_B64, DB_TEMPLATE_BYTES } from "./db-template";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Netlify Functions / Vercel / Lambda run on a read-only filesystem where only
 * the temp directory is writable, and `dev.db` is not part of the deploy.
 */
function isServerless(defaultPath: string): boolean {
  return (
    Boolean(
      process.env.NETLIFY ||
        process.env.NETLIFY_LOCAL ||
        process.env.VERCEL ||
        process.env.AWS_LAMBDA_FUNCTION_NAME ||
        process.env.AWS_EXECUTION_ENV ||
        process.env.LAMBDA_TASK_ROOT ||
        process.env.FUNCTIONS_WORKER_RUNTIME
    ) ||
    // No local database file in this working directory (fresh checkout / CI /
    // serverless bundle) — the default path would not be writable anyway.
    !fs.existsSync(defaultPath)
  );
}

/** Materialise a writable SQLite file in the temp dir from the embedded template. */
function prepareTempDatabase(): string {
  const target = path.join(os.tmpdir(), "meeras-beauty-saga.sqlite");

  try {
    if (fs.existsSync(target) && fs.statSync(target).size > 0) return target;
    const buffer = zlib.gunzipSync(Buffer.from(DB_TEMPLATE_B64, "base64"));
    fs.writeFileSync(target, buffer);
    console.info(
      `[prisma] bootstrapped SQLite database at ${target} (${buffer.length}/${DB_TEMPLATE_BYTES} bytes)`
    );
  } catch (error) {
    console.error("[prisma] could not bootstrap the SQLite database:", error);
  }

  return target;
}

function resolveDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL ?? "";

  // Non-SQLite databases (PostgreSQL/MySQL) are passed through untouched.
  const looksSqlite =
    configured === "" ||
    configured.startsWith("file:") ||
    /\.(db|sqlite|sqlite3)(\?|$)/.test(configured);

  if (!looksSqlite) return configured;

  // An explicit path other than the default local one is respected.
  if (configured && configured !== "file:./dev.db" && configured !== "dev.db") {
    return configured;
  }

  const file = configured.startsWith("file:") ? configured.slice(5) : "dev.db";
  const defaultPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);

  if (!isServerless(defaultPath)) {
    return `file:${defaultPath}`;
  }

  return `file:${prepareTempDatabase()}`;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Runs a database operation without ever letting a storage failure crash the
 * request. Returns the fallback value instead.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[prisma] query failed:", error);
    return fallback;
  }
}
