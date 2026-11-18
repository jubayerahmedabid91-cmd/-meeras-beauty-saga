import type { Metadata } from "next";
import Link from "next/link";
import { Settings, Building2, Clock, Globe, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BusinessSettingsForm } from "@/components/admin/business-settings-form";
import { ClaimsSettingsForm } from "@/components/admin/claims-settings-form";
import { getClaims } from "@/lib/claims";
import { getWhatsAppMessages } from "@/lib/whatsapp";
import { WhatsAppSettingsForm } from "@/components/admin/whatsapp-settings-form";

export const metadata: Metadata = { title: "Settings" };

const PLACEHOLDER = /to be provided|placeholder|tbd/i;

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

  const rawWhatsapp = String(map.whatsapp ?? "").trim();
  const whatsappConfigured =
    rawWhatsapp.length >= 8 && !PLACEHOLDER.test(rawWhatsapp) && /\d{8,}/.test(rawWhatsapp);

  const [claims, waMessages] = await Promise.all([getClaims(), getWhatsAppMessages()]);

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
          <p className="mt-3 rounded-xl bg-pastel-pink px-3 py-2 text-xs text-muted">
            Saved values appear across the public website (header hours strip, footer, contact
            section, tracking page). Leave a field empty to hide it from the website.
          </p>
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
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Brand &amp; Logo</h2>
              <p className="text-xs text-muted">Logo shown in the header and footer</p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-pastel-pink px-3 py-2 text-xs text-muted">
            Paste the URL of your logo file (e.g. <span className="font-mono">/assets/logo.png</span>{" "}
            after replacing that file, or an external image URL). Leave empty to use the official
            brand mark.
          </p>
          <p className="mt-3 text-xs">
            <Link
              href="/admin/website/media"
              className="font-semibold text-rose-gold underline-offset-2 hover:underline"
            >
              Upload a logo from the Media Library →
            </Link>
          </p>
          <div className="mt-4">
            <BusinessSettingsForm
              initial={{ logo_url: String(map.logo_url ?? "") }}
              keys={["logo_url"]}
            />
          </div>
        </div>

        <ClaimsSettingsForm
          initial={{
            certifiedArtists: claims.certifiedArtists,
            authenticProducts: claims.authenticProducts,
            hygienicSuite: claims.hygienicSuite,
            happyBrides: claims.happyBrides,
          }}
        />

        <WhatsAppSettingsForm
          initial={{
            default: waMessages.default,
            booking: waMessages.booking,
            service: waMessages.service,
            bridal: waMessages.bridal,
          }}
        />

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

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Integrations</h2>
              <p className="text-xs text-muted">Current configuration status — nothing is faked</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">WhatsApp</span>
              <span className={whatsappConfigured ? "font-semibold text-emerald-600" : "font-semibold"}>
                {whatsappConfigured
                  ? `Configured (${String(map.whatsapp)})`
                  : "Not configured — set the WhatsApp number above"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Email / SMTP</span>
              <span className="font-semibold">Not configured — requires SMTP credentials</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Online payments</span>
              <span className="font-semibold">Not configured — requires a payment provider account</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
