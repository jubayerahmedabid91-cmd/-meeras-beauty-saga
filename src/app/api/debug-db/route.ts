import { NextResponse } from "next/server";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Diagnostics for the serverless database bootstrap. Publicly readable but
 * only reports non-sensitive environment/shape information.
 */
export async function GET() {
  const info: Record<string, unknown> = {
    node: process.version,
    cwd: process.cwd(),
    tmpdir: os.tmpdir(),
    env: {
      NETLIFY: process.env.NETLIFY ?? null,
      NETLIFY_LOCAL: process.env.NETLIFY_LOCAL ?? null,
      LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT ?? null,
      VERCEL: process.env.VERCEL ?? null,
      DATABASE_URL: process.env.DATABASE_URL ? "<set>" : null,
      AUTH_SECRET: process.env.AUTH_SECRET ? "<set>" : null,
    },
    files: {
      devDbInCwd: fs.existsSync(path.join(process.cwd(), "dev.db")),
      tmpDb: (() => {
        const p = path.join(os.tmpdir(), "meeras-beauty-saga.sqlite");
        return fs.existsSync(p) ? fs.statSync(p).size : null;
      })(),
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    info.rawQuery = "ok";
  } catch (error) {
    info.rawQuery = "failed";
    info.rawError = error instanceof Error ? error.message : String(error);
  }

  try {
    info.tables = {
      serviceCategories: await prisma.serviceCategory.count(),
      services: await prisma.service.count(),
      users: await prisma.user.count(),
    };
  } catch (error) {
    info.tables = "failed";
    info.tableError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(info);
}
