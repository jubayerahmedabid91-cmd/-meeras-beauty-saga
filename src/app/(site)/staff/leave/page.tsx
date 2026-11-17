import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeaveRequestForm } from "@/components/staff/leave-request-form";
import { EmptyState } from "@/components/empty-state";
import { CalendarOff } from "lucide-react";

export const metadata: Metadata = { title: "Leave Requests" };

export default async function StaffLeavePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const staff = await prisma.staff.findUnique({ where: { userId: session.user.id } });
  if (!staff) redirect("/auth/login");

  const requests = await prisma.leaveRequest.findMany({
    where: { staffId: staff.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Leave Requests</h1>
        <p className="mt-1 text-sm text-muted">Request time off and track approval status.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">New request</h2>
        <div className="mt-4">
          <LeaveRequestForm />
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<CalendarOff className="h-6 w-6" />}
          title="No leave requests"
          description="Your submitted requests will appear here."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-semibold">
                  {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                </p>
                {r.reason && <p className="mt-1 text-xs text-muted">{r.reason}</p>}
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  r.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700"
                    : r.status === "REJECTED"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
