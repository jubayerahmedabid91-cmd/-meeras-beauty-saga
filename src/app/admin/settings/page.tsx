import type { Metadata } from "next";
import { Settings, Building2, Clock, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BusinessSettingsForm } from "@/components/admin/business-settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.businessSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) {
    try {
      map[s.key] = JSON.parse(s.value);
    } catch {
      map[s.key] = s.value;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Business information shown across the website and used for bookings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Business information</h2>
              <p className="text-xs text-muted">Name, address, contact details</p>
            </div>
          </div>
          <div className="mt-4">
            <BusinessSettingsForm
              initial={{
                salon_name: String(map.salon_name ?? ""),
                salon_subtitle: String(map.salon_subtitle ?? ""),
                address: String(map.address ?? ""),
                phone: String(map.phone ?? ""),
                whatsapp: String(map.whatsapp ?? ""),
                email: String(map.email ?? ""),
              }}
              keys={["salon_name", "salon_subtitle", "address", "phone", "whatsapp", "email"]}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Regional</h2>
              <p className="text-xs text-muted">Currency and timezone</p>
            </div>
          </div>
          <div className="mt-4">
            <BusinessSettingsForm
              initial={{
                currency: String(map.currency ?? "USD"),
                timezone: String(map.timezone ?? "Asia/Dhaka"),
                language: String(map.language ?? "en"),
              }}
              keys={["currency", "timezone", "language"]}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Booking rules</h2>
              <p className="text-xs text-muted">Buffer, advance notice, cancellation</p>
            </div>
          </div>
          <div className="mt-4">
            <BusinessSettingsForm
              initial={{
                bufferMin: Number((map.booking as { bufferMin?: number })?.bufferMin ?? 15),
                minAdvanceHours: Number((map.booking as { minAdvanceHours?: number })?.minAdvanceHours ?? 2),
                maxAdvanceDays: Number((map.booking as { maxAdvanceDays?: number })?.maxAdvanceDays ?? 60),
                cancellationHours: Number((map.booking as { cancellationHours?: number })?.cancellationHours ?? 12),
              }}
              keys={["bufferMin", "minAdvanceHours", "maxAdvanceDays", "cancellationHours"]}
              nestedKey="booking"
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Integrations</h2>
              <p className="text-xs text-muted">Email, WhatsApp, payments, AI</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Email / SMTP</span>
              <span className="font-semibold">Not configured</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">WhatsApp</span>
              <span className="font-semibold">Not configured</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Online payments</span>
              <span className="font-semibold">Not configured</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">AI features</span>
              <span className="font-semibold">Disabled</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
