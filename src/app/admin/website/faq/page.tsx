import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { CircleHelp } from "lucide-react";

export const metadata: Metadata = { title: "FAQ Management" };

export default async function AdminWebsiteFAQPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">FAQ</h1>
        <p className="mt-1 text-sm text-muted">Frequently asked questions shown on the website.</p>
      </div>

      {faqs.length === 0 ? (
        <EmptyState icon={<CircleHelp className="h-6 w-6" />} title="No FAQs" description="Add FAQs to help customers." />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {faqs.map((f) => (
            <div key={f.id} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{f.question}</p>
                <p className="mt-1 text-sm text-muted">{f.answer}</p>
              </div>
              <Badge tone={f.isVisible ? "rose" : "outline"}>{f.isVisible ? "Visible" : "Hidden"}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
