import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Users, CreditCard, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/badge";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Admin Dashboard" };

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
  ]);

  const stats = [
    { label: "Total bookings", value: totalBookings, icon: Calendar, tone: "text-rose-gold bg-rose-gold/10" },
    { label: "Today", value: todayBookings, icon: Clock, tone: "text-sky-600 bg-sky-100" },
    { label: "Pending", value: pendingBookings, icon: Clock, tone: "text-amber-600 bg-amber-100" },
    { label: "Confirmed", value: confirmedBookings, icon: CheckCircle, tone: "text-emerald-600 bg-emerald-100" },
    { label: "Completed", value: completedBookings, icon: CheckCircle, tone: "text-indigo-600 bg-indigo-100" },
    { label: "Cancelled", value: cancelledBookings, icon: XCircle, tone: "text-rose-600 bg-rose-100" },
    { label: "Customers", value: totalCustomers, icon: Users, tone: "text-violet-600 bg-violet-100" },
    { label: "Revenue", value: formatMoney(revenueAgg._sum.amountCents ?? 0), icon: CreditCard, tone: "text-emerald-600 bg-emerald-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Business overview and today's activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.04}>
            <div className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted truncate">{s.label}</p>
                <p className="text-xl font-bold leading-tight">{s.value}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

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
