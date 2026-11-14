import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { UserSquare2 } from "lucide-react";

export const metadata: Metadata = { title: "Team Profiles" };

export default async function AdminWebsiteTeamPage() {
  const team = await prisma.teamProfile.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Team Profiles</h1>
        <p className="mt-1 text-sm text-muted">Team members shown on the public website.</p>
      </div>

      {team.length === 0 ? (
        <EmptyState icon={<UserSquare2 className="h-6 w-6" />} title="No team profiles" description="Add team profiles to introduce your specialists." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((t) => (
            <div key={t.id} className="card p-5">
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-rose-gold">{t.role}</p>
              {t.bio && <p className="mt-2 text-xs text-muted">{t.bio}</p>}
              <div className="mt-3">
                <Badge tone={t.isVisible ? "rose" : "outline"}>{t.isVisible ? "Visible" : "Hidden"}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
