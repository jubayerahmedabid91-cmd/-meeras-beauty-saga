import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Business Hours" };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function AdminBusinessHoursPage() {
  const settings = await prisma.businessSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) {
    try {
      map[s.key] = JSON.parse(s.value);
    } catch {
      map[s.key] = s.value;
    }
  }
  const hours = (map.opening_hours as Record<string, { open: string; close: string }>) ?? {};

  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Business Hours</h1>
        <p className="mt-1 text-sm text-muted">Opening hours and holiday closures.</p>
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Weekly hours</h2>
        </div>
        <ul className="divide-y divide-charcoal/5">
          {DAYS.map((day) => {
            const h = hours[day.toLowerCase()];
            return (
              <li key={day} className="flex items-center justify-between p-4">
                <span className="font-semibold">{day}</span>
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Clock className="h-3.5 w-3.5 text-rose-gold" />
                  {h ? `${h.open} – ${h.close}` : "Closed"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Holidays</h2>
        </div>
        {holidays.length === 0 ? (
          <p className="p-6 text-sm text-muted">No holidays configured.</p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {holidays.map((h) => (
              <li key={h.id} className="flex items-center justify-between p-4">
                <span className="font-semibold">{h.name}</span>
                <span className="text-sm text-muted">{new Date(h.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
