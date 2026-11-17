import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Shared booking-lookup helpers.
 *
 * Used by the public /track-booking page, the /customer dashboard lookup and
 * the /api/customer/bookings/lookup endpoint so every surface matches
 * bookings with exactly the same rules.
 */

export type BookingLookupItem = {
  id: string;
  bookingNumber: string;
  service: string;
  startsAt: string; // ISO string
  totalCents: number;
  status: string;
  staffName: string | null;
  customerName: string;
};

const BOOKING_INCLUDE = {
  service: true,
  package: true,
  staff: true,
  customer: { select: { firstName: true, lastName: true } },
} satisfies Prisma.BookingInclude;

type BookingWithRelations = {
  id: string;
  bookingNumber: string;
  startsAt: Date;
  totalCents: number;
  status: string;
  service: { name: string } | null;
  package: { name: string } | null;
  staff: { firstName: string; lastName: string } | null;
  customer: { firstName: string; lastName: string };
};

export function serializeBooking(b: BookingWithRelations): BookingLookupItem {
  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    service: b.service?.name ?? b.package?.name ?? "Appointment",
    startsAt: b.startsAt.toISOString(),
    totalCents: b.totalCents,
    status: b.status,
    staffName: b.staff ? `${b.staff.firstName} ${b.staff.lastName}` : null,
    customerName: `${b.customer.firstName} ${b.customer.lastName}`.trim() || "Guest",
  };
}

/**
 * Finds bookings by a free-form identifier: booking number (MB-XXXX), phone
 * number or email. Matching is deliberately lenient on phones — the stored
 * number may carry a country code, so we match on the trailing digits.
 */
export async function findBookingsByIdentifier(
  rawQuery: string,
  limit = 20,
): Promise<BookingLookupItem[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const digits = query.replace(/\D/g, "");
  const looksLikeEmail = query.includes("@") && query.includes(".");
  const looksLikeBookingNumber = /^mb[-\s]/i.test(query) || /^mb/i.test(query);

  const branches: NonNullable<Prisma.BookingWhereInput["OR"]> = [];
  if (looksLikeBookingNumber || (!looksLikeEmail && digits.length < 8)) {
    branches.push({ bookingNumber: { equals: query, mode: "insensitive" as const } });
  }
  if (digits.length >= 8) {
    branches.push({ customer: { user: { phone: { endsWith: digits } } } });
  }
  if (looksLikeEmail) {
    branches.push({ customer: { user: { email: { equals: query, mode: "insensitive" as const } } } });
  }
  if (branches.length === 0) return [];

  const bookings = await prisma.booking.findMany({
    where: { OR: branches },
    orderBy: { startsAt: "desc" },
    take: limit,
    include: BOOKING_INCLUDE,
  });

  return bookings.map(serializeBooking);
}

/** All bookings for one customer, newest first. */
export async function getBookingsForCustomer(
  customerId: string,
  limit = 30,
): Promise<BookingLookupItem[]> {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    orderBy: { startsAt: "desc" },
    take: limit,
    include: BOOKING_INCLUDE,
  });
  return bookings.map(serializeBooking);
}
