import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const schema = z.object({
  action: z.enum(["approve", "unapprove"]),
});

/**
 * Owner moderation for client reviews.
 *
 * approve   -> review.isApproved = true and a public Testimonial is created
 *              (or updated) with source = "OWNER" so it appears on the site.
 * unapprove -> review.isApproved = false and the linked Testimonial is removed.
 *
 * Seeded demo testimonials (source = "SAMPLE") are never touched by this
 * endpoint — they stay invisible to the public.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const role = ((session.user as { role?: string }).role ?? "CUSTOMER") as Role;
  if (!roleHasPermission(role, "testimonial:manage")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id },
    include: { customer: true, booking: true },
  });
  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  if (parsed.data.action === "approve") {
    const displayName = `${review.customer.firstName} ${review.customer.lastName.charAt(0)}.`.trim();
    await prisma.$transaction([
      prisma.review.update({ where: { id: review.id }, data: { isApproved: true } }),
      prisma.testimonial.upsert({
        where: { reviewId: review.id },
        update: {
          name: displayName,
          rating: review.rating,
          comment: review.comment ?? "",
          source: "OWNER",
          isVisible: true,
        },
        create: {
          name: displayName,
          rating: review.rating,
          comment: review.comment ?? "",
          source: "OWNER",
          isVisible: true,
          reviewId: review.id,
        },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.review.update({ where: { id: review.id }, data: { isApproved: false } }),
      prisma.testimonial.deleteMany({ where: { reviewId: review.id } }),
    ]);
  }

  await audit({
    userId: (session.user as { id?: string }).id,
    action: `review.${parsed.data.action}`,
    entity: "review",
    entityId: review.id,
    metadata: { bookingId: review.bookingId, rating: review.rating },
  });

  return NextResponse.json({ ok: true });
}
