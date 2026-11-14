import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    name: "Meera's - The Beauty Saga",
    version: "1.0.0",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
