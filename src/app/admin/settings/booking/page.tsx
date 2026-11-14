import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { BusinessSettingsForm } from "@/components/admin/business-settings-form";

export const metadata: Metadata = { title: "Booking Settings" };

export default function AdminBookingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Booking Settings</h1>
        <p className="mt-1 text-sm text-muted">Rules that govern online and in-salon bookings.</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <CalendarClock className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-bold">Booking rules</h2>
        </div>
        <div className="mt-4">
          <BusinessSettingsForm
            initial={{
              bufferMin: 15,
              minAdvanceHours: 2,
              maxAdvanceDays: 60,
              cancellationHours: 12,
            }}
            keys={["bufferMin", "minAdvanceHours", "maxAdvanceDays", "cancellationHours"]}
            nestedKey="booking"
          />
        </div>
      </div>
    </div>
  );
}
