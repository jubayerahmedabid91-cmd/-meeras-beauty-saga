import { NextResponse } from "next/server";
import { findBookingsByIdentifier } from "@/lib/booking-lookup";

/**
 * Public booking lookup for the /customer dashboard (used when a visitor is
 * not signed in). Accepts a booking number, phone number or email and returns
 * a minimal, non-sensitive projection of the matching bookings.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json(
      { error: "Enter your booking ID, phone number or email." },
      { status: 400 },
    );
  }

  // A booking number looks like MB-XXXX; anything else needs a phone (8+
  // digits) or a real email, so we never expose bookings to trivial probing.
  const digits = q.replace(/\D/g, "");
  const looksLikeEmail = q.includes("@") && q.includes(".");
  const looksLikeBookingNumber = /^mb/i.test(q);
  if (!looksLikeBookingNumber && digits.length < 8 && !looksLikeEmail) {
    return NextResponse.json(
      { error: "Enter a valid booking ID, phone number or email." },
      { status: 400 },
    );
  }

  try {
    const bookings = await findBookingsByIdentifier(q, 20);
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while looking up your bookings." },
      { status: 500 },
    );
  }
}
