import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CalendarDays, History, MessageCircle, Sparkles } from "lucide-react";
import { safeAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWhatsAppDigits } from "@/lib/data";
import { getWhatsAppMessages } from "@/lib/whatsapp";
import { getBookingsForCustomer, type BookingLookupItem } from "@/lib/booking-lookup";
import { Reveal } from "@/components/reveal";
import { BookingLookup, LookupBookingCard } from "@/components/customer/booking-lookup";

export const metadata: Metadata = { title: "Customer Dashboard" };

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "RESCHEDULED"];

/**
 * Customer dashboard.
 *
 * - Signed-in customers see their upcoming & past appointments automatically.
 * - Visitors get a phone / email / booking-ID lookup — no login required.
 * - Either way: Book New Appointment + WhatsApp quick help.
 */
export default async function CustomerDashboardPage() {
  const session = await safeAuth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const [whatsappDigits, waMessages] = await Promise.all([
    getWhatsAppDigits(),
    getWhatsAppMessages(),
  ]);

  // ── Signed-in customer: load their bookings ──────────────────────────────
  let bookings: BookingLookupItem[] | null = null;
  let firstName: string | null = null;

  if (session?.user && role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({
      where: { userId: (session.user as { id?: string }).id },
      select: { id: true, firstName: true },
    });
    if (customer) {
      firstName = customer.firstName;
      bookings = await getBookingsForCustomer(customer.id);
    }
  }

  const upcoming = bookings?.filter(
    (b) => ACTIVE_STATUSES.includes(b.status) && new Date(b.startsAt) >= new Date(),
  );
  const past = bookings?.filter(
    (b) => !ACTIVE_STATUSES.includes(b.status) || new Date(b.startsAt) < new Date(),
  );

  const waMessage = waMessages.booking;

  return (
    <section className="pattern-surface py-12 md:py-16">
      <div className="container-site space-y-10">
        {/* ── Greeting + primary actions ── */}
        <Reveal className="text-center">
          <span className="eyebrow justify-center">My Beauty Saga</span>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            {firstName ? `Welcome back, ${firstName}` : "Your appointments, beautifully organised"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            {firstName
              ? "All your upcoming and past appointments with Meera's — in one elegant place."
              : "Look up your bookings instantly with your phone number, email or booking ID."}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/booking" className="btn-primary !px-7 !py-3.5 !text-base">
              <Calendar className="h-5 w-5" />
              Book New Appointment
            </Link>
            {whatsappDigits && (
              <a
                href={`https://wa.me/${whatsappDigits}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass !px-7 !py-3.5 !text-base"
              >
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                Chat on WhatsApp
              </a>
            )}
          </div>
        </Reveal>

        {/* ── Not signed in: lookup ── */}
        {bookings === null && (
          <Reveal delay={0.08}>
            <BookingLookup whatsappDigits={whatsappDigits} message={waMessage} />
            <p className="mt-8 text-center text-sm text-muted">
              Have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-rose-gold hover:underline">
                Sign in
              </Link>{" "}
              to see your full history, loyalty points and favourites.
            </p>
          </Reveal>
        )}

        {/* ── Signed in: upcoming & past ── */}
        {bookings !== null && (
          <>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-gold/10 text-rose-gold">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold md:text-2xl">Upcoming appointments</h2>
              </div>
              {upcoming!.length === 0 ? (
                <div className="card mt-4 p-8 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-rose-gold" />
                  <p className="mt-3 font-bold">Nothing booked yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Your next self-care moment is one tap away.
                  </p>
                  <Link href="/booking" className="btn-primary mt-5">
                    Book New Appointment
                  </Link>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {upcoming!.map((b) => (
                    <LookupBookingCard key={b.id} booking={b} whatsappDigits={whatsappDigits} message={waMessage} />
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-charcoal/5 text-muted">
                  <History className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold md:text-2xl">Past appointments</h2>
              </div>
              {past!.length === 0 ? (
                <p className="card mt-4 p-6 text-center text-sm text-muted">
                  Your visit history will appear here after your first appointment.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {past!.map((b) => (
                    <LookupBookingCard key={b.id} booking={b} whatsappDigits={whatsappDigits} message={waMessage} />
                  ))}
                </div>
              )}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
