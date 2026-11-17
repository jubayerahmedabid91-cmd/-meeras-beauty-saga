import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

const schema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

/**
 * Customer submits a review for a completed booking of their own.
 *
 * Reviews are never published directly: they land in the moderation queue
 * (isApproved = false) and only appear publicly once the owner approves them
 * in Admin → Website → Customer Reviews. One review per booking (unique
 * bookingId constraint).
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { userId: (session.user as { id: string }).id },
  });
  if (!customer) {
    return NextResponse.json({ error: "Customer profile not found." }, { status: 404 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please give a rating between 1 and 5." }, { status: 400 });
  }

  const { bookingId, rating, comment } = parsed.data;
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: customer.id },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "You can only review a booking once the appointment is completed." },
      { status: 400 },
    );
  }

  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) {
    return NextResponse.json({ error: "You already reviewed this booking." }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      customerId: customer.id,
      bookingId: booking.id,
      rating,
      comment: comment?.trim() || null,
      isApproved: false,
    },
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "review.submit",
    entity: "review",
    entityId: review.id,
    metadata: { bookingId: booking.id, rating },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
