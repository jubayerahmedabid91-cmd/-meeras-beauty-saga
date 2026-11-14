import type { Metadata } from "next";
import Link from "next/link";
import { UsersRound, Gift } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";

export const metadata: Metadata = { title: "Referrals" };

export default async function AdminReferralsPage() {
  const referrals = await prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Referrals</h1>
        <p className="mt-1 text-sm text-muted">Customer referral activity and rewards.</p>
      </div>

      {referrals.length === 0 ? (
        <EmptyState
          icon={<UsersRound className="h-6 w-6" />}
          title="No referrals"
          description="Referral activity will appear here as customers refer friends."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Referred email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reward</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-semibold">{r.referredEmail}</td>
                  <td className="p-4">
                    <Badge tone={r.status === "COMPLETED" ? "rose" : "charcoal"}>{r.status}</Badge>
                  </td>
                  <td className="p-4">{r.rewardCents > 0 ? `$${(r.rewardCents / 100).toFixed(2)}` : "-"}</td>
                  <td className="p-4 text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
