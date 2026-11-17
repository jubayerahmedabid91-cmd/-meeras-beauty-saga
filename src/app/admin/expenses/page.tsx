import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/components/price";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Expenses" };

export default async function AdminExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { incurredAt: "desc" } });
  const total = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Expenses</h1>
        <p className="mt-1 text-sm text-muted">Business expenses and spending records.</p>
      </div>

      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total expenses</p>
        <p className="mt-2 text-2xl font-bold text-rose-600"><Price cents={total} /></p>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title="No expenses recorded"
          description="Record expenses to track business spending."
        />
      ) : (
        <div className="card divide-y divide-charcoal/5">
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{e.category}</p>
                <p className="text-xs text-muted">{e.description}</p>
                <p className="text-xs text-muted">{new Date(e.incurredAt).toLocaleDateString()}</p>
              </div>
              <span className="font-bold text-rose-600"><Price cents={e.amountCents} /></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
