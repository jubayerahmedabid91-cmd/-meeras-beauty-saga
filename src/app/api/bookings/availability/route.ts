import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Same slot grid the booking wizard offers. */
export const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"];

/**
 * How many bookings can run concurrently in one time slot.
 *
 * The limit is the number of active specialists (staff whose account is also
 * active). If no specialist is configured the salon stays bookable, so the
 * limit falls back to 1 instead of blocking every slot.
 */
async function activeSpecialistCount(): Promise<number> {
  const count = await prisma.staff.count({
    where: { isActive: true, user: { isActive: true } },
  });
  return Math.max(count, 1);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "A valid date (YYYY-MM-DD) is required." }, { status: 400 });
  }

  let capacity = 1;
  let bookings: { startsAt: Date }[] = [];

  try {
    [capacity, bookings] = await Promise.all([
      activeSpecialistCount(),
      prisma.booking.findMany({
        where: {
          startsAt: {
            gte: new Date(`${date}T00:00:00`),
            lt: new Date(`${date}T23:59:59.999`),
          },
          status: { in: ACTIVE_STATUSES },
        },
        select: { startsAt: true },
      }),
    ]);
  } catch (error) {
    // Database unreachable (e.g. serverless host where the native SQLite
    // addon cannot load): leave every slot open rather than failing the page.
    console.error("[availability] lookup failed, treating all slots as open:", error);
  }

  const takenBySlot = new Map<string, number>();
  for (const booking of bookings) {
    const local = new Date(booking.startsAt);
    const hh = String(local.getHours()).padStart(2, "0");
    const mm = String(local.getMinutes()).padStart(2, "0");
    const key = `${hh}:${mm}`;
    takenBySlot.set(key, (takenBySlot.get(key) ?? 0) + 1);
  }

  const slots = TIME_SLOTS.map((time) => {
    const taken = takenBySlot.get(time) ?? 0;
    const remaining = Math.max(capacity - taken, 0);
    return { time, taken, remaining, available: remaining > 0 };
  });

  return NextResponse.json({ date, capacity, slots });
}
