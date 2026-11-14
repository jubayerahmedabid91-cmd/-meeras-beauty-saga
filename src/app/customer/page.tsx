import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Customer Dashboard" };

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });
  if (!customer) redirect("/auth/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: customer.id },
    orderBy: { startsAt: "desc" },
    take: 5,
    include: { service: true, package: true, staff: true, payment: true },
  });

  const upcoming = bookings.filter((b) =>
    ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"].includes(b.status),
  );
  const past = bookings.filter((b) => ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(b.status));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Hello, {customer.firstName}</h1>
        <p className="mt-1 text-sm text-muted">Here is an overview of your account and bookings.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Reveal>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Upcoming</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{upcoming.length}</p>
            <p className="mt-1 text-xs text-muted">appointments</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Completed</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{past.filter((b) => b.status === "COMPLETED").length}</p>
            <p className="mt-1 text-xs text-muted">visits</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Loyalty points</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{customer.loyaltyPoints}</p>
            <p className="mt-1 text-xs text-muted">available</p>
          </div>
        </Reveal>
      </div>

      {/* Upcoming appointments */}
      <Reveal>
        <div className="card">
          <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Upcoming appointments</h2>
            <Link href="/customer/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-rose-gold/40" />
              <p className="mt-3 text-sm text-muted">No upcoming appointments.</p>
              <Link href="/booking" className="btn-primary mt-4">
                Book now
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {upcoming.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{b.service?.name ?? b.package?.name ?? "Appointment"}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(b.startsAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(b.startsAt)}
                      </span>
                      {b.staff && <span>with {b.staff.firstName} {b.staff.lastName}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-rose-gold">{formatMoney(b.totalCents)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {/* Quick actions */}
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/booking", title: "Book appointment", text: "Schedule your next visit" },
            { href: "/customer/favourites", title: "Favourites", text: "Your saved services" },
            { href: "/customer/loyalty", title: "Loyalty rewards", text: "View points and offers" },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="card card-hover p-5">
              <h3 className="font-bold">{a.title}</h3>
              <p className="mt-1 text-xs text-muted">{a.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-gold">
                Open
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
