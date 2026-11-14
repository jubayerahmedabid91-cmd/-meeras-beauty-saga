import type { Metadata } from "next";
import { BusinessSettingsForm } from "@/components/admin/business-settings-form";

export const metadata: Metadata = { title: "SEO Settings" };

export default function AdminWebsiteSEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">SEO Settings</h1>
        <p className="mt-1 text-sm text-muted">Metadata used by search engines and social sharing.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Default metadata</h2>
        <div className="mt-4">
          <BusinessSettingsForm
            initial={{
              title: "Meera's - The Beauty Saga | Premium Beauty Salon",
              description: "Premium beauty salon offering hair, makeup, bridal and skin care services.",
              keywords: "beauty salon, bridal makeup, hair styling, facial",
            }}
            keys={["title", "description", "keywords"]}
            nestedKey="seo"
          />
        </div>
      </div>
    </div>
  );
}
