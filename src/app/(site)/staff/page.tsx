import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Staff Dashboard" };

export default async function StaffDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const staff = await prisma.staff.findUnique({ where: { userId: session.user.id } });
  if (!staff) redirect("/auth/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayBookings, upcomingBookings, completedCount] = await Promise.all([
    prisma.booking.findMany({
      where: { staffId: staff.id, startsAt: { gte: today, lt: tomorrow } },
      orderBy: { startsAt: "asc" },
      include: { customer: true, service: true, package: true },
    }),
    prisma.booking.findMany({
      where: {
        staffId: staff.id,
        startsAt: { gte: tomorrow },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      orderBy: { startsAt: "asc" },
      take: 8,
      include: { customer: true, service: true, package: true },
    }),
    prisma.booking.count({
      where: { staffId: staff.id, status: "COMPLETED" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Hello, {staff.firstName}</h1>
        <p className="mt-1 text-sm text-muted">
          {staff.jobTitle} · Here is your schedule and appointments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Reveal>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Today</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{todayBookings.length}</p>
            <p className="mt-1 text-xs text-muted">appointments</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Upcoming</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{upcomingBookings.length}</p>
            <p className="mt-1 text-xs text-muted">scheduled</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Completed</p>
            <p className="mt-2 text-3xl font-bold text-rose-gold">{completedCount}</p>
            <p className="mt-1 text-xs text-muted">total visits</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="card">
          <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Today&rsquo;s schedule</h2>
            <Link href="/staff/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold">
              All appointments
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {todayBookings.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-rose-gold/40" />
              <p className="mt-3 text-sm text-muted">No appointments scheduled for today.</p>
            </div>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {todayBookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(b.startsAt)} – {formatTime(b.endsAt)}
                      </span>
                      <span>Client: {b.customer.firstName} {b.customer.lastName}</span>
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {upcomingBookings.length > 0 && (
        <Reveal>
          <div className="card">
            <div className="border-b border-charcoal/10 p-5">
              <h2 className="text-lg font-bold">Upcoming appointments</h2>
            </div>
            <ul className="divide-y divide-charcoal/5">
              {upcomingBookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{b.service?.name ?? b.package?.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(b.startsAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(b.startsAt)}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </div>
  );
}
