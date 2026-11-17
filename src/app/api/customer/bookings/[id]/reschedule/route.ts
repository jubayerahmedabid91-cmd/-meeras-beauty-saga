import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

const schema = z.object({
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date."),
  preferredTime: z.string().max(10).optional(),
  note: z.string().max(500).optional(),
});

/**
 * Customer requests a reschedule. The salon receives the request as a contact
 * message (visible in Admin → Website → Contact) and confirms a new slot with
 * the customer before the appointment is moved. We deliberately do not silently
 * mutate the booking — the original slot stays valid until the salon confirms.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { userId: (session.user as { id: string }).id },
    include: { user: true },
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
      { error: "This booking can no longer be rescheduled. Please contact the salon." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check your details." }, { status: 400 });
  }

  const { preferredDate, preferredTime, note } = parsed.data;
  const customerName = `${customer.firstName} ${customer.lastName}`.trim();
  const serviceName = booking.service?.name ?? booking.package?.name ?? "Appointment";

  await prisma.contactMessage.create({
    data: {
      name: customerName,
      email: customer.user.email,
      phone: customer.user.phone,
      subject: `Reschedule request — ${booking.bookingNumber}`,
      message: [
        `Customer requests to reschedule booking ${booking.bookingNumber} (${serviceName}).`,
        `Current slot: ${booking.startsAt.toDateString()} ${booking.startsAt.toTimeString().slice(0, 5)}.`,
        `Preferred new date: ${preferredDate}${preferredTime ? ` around ${preferredTime}` : ""}.`,
        note ? `Customer note: ${note}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
  });

  await audit({
    userId: (session.user as { id?: string }).id,
    action: "booking.reschedule_request",
    entity: "booking",
    entityId: booking.id,
    metadata: { bookingNumber: booking.bookingNumber, preferredDate, preferredTime: preferredTime ?? null },
  });

  return NextResponse.json({ ok: true });
}
