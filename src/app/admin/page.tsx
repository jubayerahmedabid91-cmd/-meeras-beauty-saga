import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Users, CreditCard, Clock, CheckCircle, XCircle, ArrowRight, Banknote, TrendingUp, CalendarDays, UserCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/empty-state";
import { RevenueChart, type TrendPoint } from "@/components/admin/revenue-chart";
import { BookingRowActions } from "@/components/admin/booking-row-actions";

export const metadata: Metadata = { title: "Admin Dashboard" };

type TrendRow = { bookedAt: Date; totalCents: number; status: string };

/** Buckets the last 14 days into a per-day revenue / booking trend. */
function buildTrend(rows: TrendRow[]): TrendPoint[] {
  const days: TrendPoint[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const inDay = rows.filter((r) => r.bookedAt >= d && r.bookedAt < next);
    days.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      revenue: inDay
        .filter((r) => r.status !== "CANCELLED")
        .reduce((sum, r) => sum + r.totalCents, 0),
      bookings: inDay.length,
    });
  }
  return days;
}

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalBookings,
    todayBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalCustomers,
    revenueAgg,
    upcomingBookings,
    recentBookings,
    todayRevenueAgg,
    monthRevenueAgg,
    activeStaff,
    trendRows,
    pendingList,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { startsAt: { gte: today, lt: tomorrow } } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.customer.count(),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
    prisma.booking.findMany({
      where: { startsAt: { gte: tomorrow }, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { startsAt: "asc" },
      take: 5,
      include: { customer: true, service: true, package: true, staff: true },
    }),
    prisma.booking.findMany({
      orderBy: { bookedAt: "desc" },
      take: 6,
      include: { customer: true, service: true, package: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: today, lt: tomorrow } },
      _sum: { amountCents: true },
    }),
    prisma.payment.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
      },
      _sum: { amountCents: true },
    }),
    prisma.staff.count({ where: { isActive: true, user: { isActive: true } } }),
    prisma.booking.findMany({
      where: { bookedAt: { gte: new Date(Date.now() - 13 * 86_400_000) } },
      select: { bookedAt: true, totalCents: true, status: true },
    }),
    prisma.booking.findMany({
      where: { status: "PENDING" },
      orderBy: { startsAt: "asc" },
      take: 4,
      include: {
        customer: { include: { user: { select: { phone: true } } } },
        service: true,
        package: true,
        staff: true,
      },
    }),
  ]);

  const trend: TrendPoint[] = buildTrend(trendRows);

  const kpis = [
    {
      label: "Today's Revenue",
      value: formatMoney(todayRevenueAgg._sum.amountCents ?? 0),
      icon: Banknote,
      tone: "text-emerald-600 bg-emerald-100",
      hint: `${todayBookings} booking${todayBookings === 1 ? "" : "s"} today`,
    },
    {
      label: "Monthly Revenue",
      value: formatMoney(monthRevenueAgg._sum.amountCents ?? 0),
      icon: TrendingUp,
      tone: "text-rose-gold bg-rose-gold/10",
      hint: "Paid appointments this month",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarDays,
      tone: "text-sky-600 bg-sky-100",
      hint: `${pendingBookings} pending · ${confirmedBookings} confirmed`,
    },
    {
      label: "Active Staff",
      value: activeStaff,
      icon: UserCheck,
      tone: "text-violet-600 bg-violet-100",
      hint: "Specialists on the roster",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Business overview and today's activity.</p>
      </div>

      {/* ── Needs your attention: pending requests with 1-click actions ── */}
      {pendingList.length > 0 && (
        <div className="card border-amber-300/60 bg-amber-50/50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Needs your attention</h2>
            <Link
              href="/admin/bookings?status=PENDING"
              className="text-xs font-semibold text-rose-gold hover:underline"
            >
              All pending ({pendingBookings})
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {pendingList.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {b.customer.firstName} {b.customer.lastName} · {b.service?.name ?? b.package?.name ?? "Appointment"}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(b.startsAt)} at {formatTime(b.startsAt)}
                  </p>
                </div>
                <div className="shrink-0">
                  <BookingRowActions
                    booking={{
                      id: b.id,
                      bookingNumber: b.bookingNumber,
                      customerName: `${b.customer.firstName} ${b.customer.lastName}`,
                      customerPhone: b.customer.user.phone,
                      service: b.service?.name ?? b.package?.name ?? "-",
                      date: formatDate(b.startsAt),
                      time: formatTime(b.startsAt),
                      totalCents: b.totalCents,
                      discountCents: b.discountCents,
                      couponCode: b.couponCode,
                      status: b.status,
                      staffName: b.staff ? `${b.staff.firstName} ${b.staff.lastName}` : null,
                      notes: b.notes,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted truncate">
                  {s.label}
                </p>
                <p className="text-xl font-bold leading-tight">{s.value}</p>
                <p className="mt-0.5 truncate text-[0.65rem] text-muted">{s.hint}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.06}>
        <RevenueChart data={trend} />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="card">
            <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
              <h2 className="text-lg font-bold">Upcoming bookings</h2>
              <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold hover:text-rose-gold/80">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-6">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-5 w-5" />}
                  title="No upcoming bookings"
                  description="Your next appointments will appear here."
                />
              ) : (
                <ul className="space-y-3">
                  {upcomingBookings.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {b.service?.name ?? b.package?.name ?? "Appointment"}
                        </p>
                        <p className="text-xs text-muted">
                          {b.customer?.firstName ?? "Guest"} · {formatDate(b.startsAt)} {formatTime(b.startsAt)}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card">
            <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
              <h2 className="text-lg font-bold">Recent bookings</h2>
              <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-gold hover:text-rose-gold/80">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-6">
              {recentBookings.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-5 w-5" />}
                  title="No bookings yet"
                  description="Your first booking will appear here."
                />
              ) : (
                <ul className="space-y-3">
                  {recentBookings.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {b.customer?.firstName ?? "Guest"} {b.customer?.lastName ?? ""}
                        </p>
                        <p className="text-xs text-muted">
                          {b.service?.name ?? b.package?.name ?? "Appointment"} · {formatDate(b.bookedAt)}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
