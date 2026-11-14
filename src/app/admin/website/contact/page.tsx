import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/brand";
import { BusinessSettingsForm } from "@/components/admin/business-settings-form";

export const metadata: Metadata = { title: "Contact Information" };

export default async function AdminWebsiteContactPage() {
  const settings = await prisma.businessSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) {
    try {
      map[s.key] = JSON.parse(s.value);
    } catch {
      map[s.key] = s.value;
    }
  }

  const social = (map.social as { instagram?: string; facebook?: string; youtube?: string; tiktok?: string }) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Contact Information</h1>
        <p className="mt-1 text-sm text-muted">Contact details and social links shown on the website.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Contact details</h2>
        <div className="mt-4">
          <BusinessSettingsForm
            initial={{
              address: String(map.address ?? ""),
              phone: String(map.phone ?? ""),
              whatsapp: String(map.whatsapp ?? ""),
              email: String(map.email ?? ""),
            }}
            keys={["address", "phone", "whatsapp", "email"]}
          />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Social links</h2>
        <div className="mt-4">
          <BusinessSettingsForm
            initial={{
              instagram: String(social.instagram ?? ""),
              facebook: String(social.facebook ?? ""),
              youtube: String(social.youtube ?? ""),
              tiktok: String(social.tiktok ?? ""),
            }}
            keys={["instagram", "facebook", "youtube", "tiktok"]}
            nestedKey="social"
          />
        </div>
      </div>
    </div>
  );
}
