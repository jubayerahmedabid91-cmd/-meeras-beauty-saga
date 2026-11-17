import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

/**
 * Customer-initiated cancellation of their own booking.
 *
 * Rules: the booking must belong to the caller, be in PENDING or CONFIRMED
 * status, and sit outside the salon's cancellation window (the
 * `booking.cancellationHours` business setting, default 12). Inside the
 * window we refuse and ask the customer to contact the salon.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: customer.id },
    include: { service: true, package: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
    return NextResponse.json(
      { error: "This booking can no longer be cancelled online. Please contact the salon." },
      { status: 400 },
    );
  }

  const now = new Date();
  if (booking.startsAt <= now) {
    return NextResponse.json(
      { error: "This appointment has already started and cannot be cancelled online." },
      { status: 400 },
    );
  }

  // Cancellation window from the salon's booking settings (default 12h).
  let cancellationHours = 12;
  try {
    const raw = await prisma.businessSetting.findUnique({ where: { key: "booking" } });
    if (raw) {
      const parsed = JSON.parse(raw.value) as { cancellationHours?: number };
      if (Number.isFinite(parsed.cancellationHours)) cancellationHours = Number(parsed.cancellationHours);
    }
  } catch {
    // keep default
  }

  const hoursUntilStart = (booking.startsAt.getTime() - now.getTime()) / 3_600_000;
  if (hoursUntilStart < cancellationHours) {
    return NextResponse.json(
      {
        error: `Online cancellation closes ${cancellationHours} hours before the appointment. Please contact the salon directly.`,
      },
      { status: 400 },
    );
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", cancelledAt: now },
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "booking.customer_cancel",
    entity: "booking",
    entityId: booking.id,
    metadata: { bookingNumber: booking.bookingNumber, service: booking.service?.name ?? booking.package?.name ?? null },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
