import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });

  // Always respond OK to avoid leaking which emails are registered.
  if (user) {
    // TODO: generate a reset token and send email via configured provider.
    console.log(`Password reset requested for ${user.email}`);
  }

  return NextResponse.json({ ok: true });
}
