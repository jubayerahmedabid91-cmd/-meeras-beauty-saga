import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles, Gift, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = { title: "Loyalty Points" };

export default async function CustomerLoyaltyPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!customer) redirect("/auth/login");

  const transactions = await prisma.loyaltyTransaction.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const giftCards = await prisma.giftCard.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Loyalty &amp; Rewards</h1>
        <p className="mt-1 text-sm text-muted">Your loyalty points, referral code and gift cards.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-gold/10 text-rose-gold">
            <Sparkles className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Available points</p>
            <p className="text-3xl font-bold text-rose-gold">{customer.loyaltyPoints}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-gold/10 text-rose-gold">
            <Gift className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Referral code</p>
            <p className="text-2xl font-bold">{customer.referralCode || "Not set"}</p>
            <p className="text-xs text-muted">Share with friends to earn rewards</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-charcoal/10 p-5">
          <h2 className="text-lg font-bold">Points history</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            No loyalty activity yet. Points are earned when you complete visits.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal/5">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-semibold">{tx.reason}</p>
                  <p className="text-xs text-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-bold ${tx.points >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {tx.points >= 0 ? "+" : ""}{tx.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {giftCards.length > 0 && (
        <div className="card">
          <div className="border-b border-charcoal/10 p-5">
            <h2 className="text-lg font-bold">Gift cards</h2>
          </div>
          <ul className="divide-y divide-charcoal/5">
            {giftCards.map((gc) => (
              <li key={gc.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-semibold">{gc.code}</p>
                  <p className="text-xs text-muted">
                    {gc.recipientName ? `For ${gc.recipientName}` : "Purchased"} · {gc.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <span className="text-sm font-bold text-rose-gold">${(gc.balanceCents / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/booking" className="btn-primary">
        Earn points with your next visit
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
