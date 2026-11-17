import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";

export const metadata: Metadata = { title: "Gift Cards" };

export default async function AdminGiftCardsPage() {
  const giftCards = await prisma.giftCard.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Gift Cards</h1>
          <p className="mt-1 text-sm text-muted">Digital gift cards and balances.</p>
        </div>
        <Link href="/admin/gift-cards/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Issue gift card
        </Link>
      </div>

      {giftCards.length === 0 ? (
        <EmptyState title="No gift cards" description="Issue gift cards to sell or reward customers." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Code</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {giftCards.map((gc) => (
                <tr key={gc.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4 font-mono font-semibold">{gc.code}</td>
                  <td className="p-4">{gc.recipientName ?? gc.customer?.firstName ?? "-"}</td>
                  <td className="p-4 font-semibold"><Price cents={gc.balanceCents} /></td>
                  <td className="p-4">
                    <Badge tone={gc.isActive ? "rose" : "outline"}>{gc.isActive ? "Active" : "Redeemed"}</Badge>
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
