import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bookingNumber, referralCode } from "@/lib/utils";
import { evaluateCoupon, normalizeCode } from "@/lib/coupons";

const schema = z.object({
  kind: z.enum(["service", "package"]),
  serviceSlug: z.string().nullable().optional(),
  packageSlug: z.string().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  staffId: z.string().nullable().optional(),
  couponCode: z.string().max(30).optional(),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(30),
    notes: z.string().max(1000).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check your booking details." }, { status: 400 });
    }

    const { kind, serviceSlug, packageSlug, date, time, staffId, couponCode, customer } = parsed.data;

    // Resolve the booked item.
    let serviceId: string | null = null;
    let packageId: string | null = null;
    let durationMin = 60;
    let priceCents = 0;
    let name = "";

    if (kind === "service") {
      const service = await prisma.service.findUnique({ where: { slug: serviceSlug ?? "" } });
      if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
      serviceId = service.id;
      durationMin = service.durationMin;
      priceCents = service.priceCents;
      name = service.name;
    } else {
      const pkg = await prisma.package.findUnique({ where: { slug: packageSlug ?? "" } });
      if (!pkg) return NextResponse.json({ error: "Package not found." }, { status: 404 });
      packageId = pkg.id;
      durationMin = pkg.durationMin;
      priceCents = pkg.priceCents - pkg.discountCents;
      name = pkg.name;
    }

    // Apply a coupon, if one was supplied. The discount is recomputed here so
    // a tampered client can never invent a discount.
    const code = normalizeCode(couponCode);
    let discountCents = 0;
    let appliedCouponCode: string | null = null;
    if (code) {
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      const result = evaluateCoupon(coupon, priceCents);
      if (!result.ok) {
        return NextResponse.json({ error: result.reason }, { status: 400 });
      }
      discountCents = result.discountCents;
      appliedCouponCode = result.coupon.code;
    }

    // Build start/end timestamps in the salon timezone.
    const startsAt = new Date(`${date}T${time}:00`);
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
    }
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

    // ── Concurrent capacity ────────────────────────────────────────────────
    // One active specialist can take one booking per time slot, so the slot
    // capacity equals the number of active specialists. Adding or removing a
    // specialist in /admin changes this limit automatically.
    const activeSpecialists = Math.max(
      await prisma.staff.count({ where: { isActive: true, user: { isActive: true } } }),
      1,
    );
    const takenInSlot = await prisma.booking.count({
      where: {
        startsAt,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"] },
      },
    });
    if (takenInSlot >= activeSpecialists) {
      return NextResponse.json(
        {
          error: "All specialists are booked for this time slot. Please choose another time.",
          code: "SLOT_FULL",
        },
        { status: 409 },
      );
    }

    // Prevent overlapping bookings (same staff) — a simple guard.
    if (staffId) {
      const conflict = await prisma.booking.findFirst({
        where: {
          staffId,
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"] },
          OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }],
        },
      });
      if (conflict) {
        return NextResponse.json(
          { error: "This time slot is no longer available. Please choose another time." },
          { status: 409 },
        );
      }
    }

    // Find or create the customer (keyed by the user's email).
    const email = customer.email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    let customerRecord = existingUser
      ? await prisma.customer.findUnique({ where: { userId: existingUser.id } })
      : null;

    if (!existingUser) {
      const created = await prisma.user.create({
        data: {
          email,
          phone: customer.phone,
          passwordHash: "", // guest booking; account can be claimed later
          role: "CUSTOMER",
          customer: {
            create: {
              firstName: customer.name.split(" ")[0],
              lastName: customer.name.split(" ").slice(1).join(" ") || "-",
              referralCode: referralCode(),
            },
          },
        },
        include: { customer: true },
      });
      customerRecord = created.customer;
    } else if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          userId: existingUser.id,
          firstName: customer.name.split(" ")[0],
          lastName: customer.name.split(" ").slice(1).join(" ") || "-",
          referralCode: referralCode(),
        },
      });
    }

    if (!customerRecord) {
      return NextResponse.json({ error: "Could not create customer." }, { status: 500 });
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: bookingNumber(),
        customerId: customerRecord.id,
        serviceId,
        packageId,
        staffId,
        status: "PENDING",
        startsAt,
        endsAt,
        durationMin,
        subtotalCents: priceCents,
        discountCents,
        totalCents: priceCents - discountCents,
        couponCode: appliedCouponCode,
        notes: customer.notes || null,
        items: serviceId
          ? { create: [{ serviceId, name, quantity: 1, priceCents }] }
          : undefined,
      },
    });

    // Count the coupon use so max-uses limits are enforced.
    if (appliedCouponCode) {
      await prisma.coupon.update({
        where: { code: appliedCouponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ ok: true, bookingNumber: booking.bookingNumber });
  } catch (error) {
    console.error("Booking error:", error);
    // Honest failure: the booking was NOT saved, so the customer must not be
    // shown a confirmation. Point them at a human instead.
    return NextResponse.json(
      {
        error:
          "We could not save your booking online. Please call the salon to book — sorry for the inconvenience.",
        code: "BOOKING_FAILED",
      },
      { status: 500 },
    );
  }
}
