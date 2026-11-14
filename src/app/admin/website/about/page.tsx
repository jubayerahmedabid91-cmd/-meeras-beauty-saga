import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "About Page" };

export default async function AdminWebsiteAboutPage() {
  const content = await prisma.websiteContent.findMany({ where: { page: "about" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">About Page</h1>
        <p className="mt-1 text-sm text-muted">Content shown on the public About page.</p>
      </div>

      {content.length === 0 ? (
        <div className="card p-6 text-sm text-muted">
          No custom content set. The About page currently uses the default brand story.
        </div>
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {content.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{c.section} / {c.key}</p>
                <p className="mt-1 text-sm text-muted">{String(c.value).slice(0, 200)}</p>
              </div>
              <Badge tone="rose">Saved</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
