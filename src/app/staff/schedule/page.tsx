import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTime } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "My Schedule" };

export default async function StaffSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const staff = await prisma.staff.findUnique({ where: { userId: session.user.id } });
  if (!staff) redirect("/auth/login");

  const availability = await prisma.staffAvailability.findMany({
    where: { staffId: staff.id },
    orderBy: { dayOfWeek: "asc" },
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Schedule</h1>
        <p className="mt-1 text-sm text-muted">Your weekly working hours and availability.</p>
      </div>

      {availability.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No schedule set"
          description="Your weekly availability will appear here once configured by the admin."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {availability.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-5">
              <div>
                <p className="font-semibold">{days[a.dayOfWeek]}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {a.isOff ? "Day off" : `${a.startTime} – ${a.endTime}`}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  a.isOff ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {a.isOff ? "Off" : "Working"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
