import type { Metadata } from "next";
import { BarChart3, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Finance" };

export default async function AdminFinancePage() {
  const payments = await prisma.payment.findMany({ where: { status: "PAID" } });
  const expenses = await prisma.expense.findMany();

  const income = payments.reduce((sum, p) => sum + p.amountCents, 0);
  const expenseTotal = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  const byMethod: Record<string, number> = {};
  for (const p of payments) {
    byMethod[p.method] = (byMethod[p.method] ?? 0) + p.amountCents;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Finance</h1>
        <p className="mt-1 text-sm text-muted">Income, expenses and financial summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted">Total income</p>
              <p className="text-xl font-bold text-emerald-600">{formatMoney(income)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted">Total expenses</p>
              <p className="text-xl font-bold text-rose-600">{formatMoney(expenseTotal)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted">Net (income − expenses)</p>
          <p className={`mt-2 text-2xl font-bold ${income - expenseTotal >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatMoney(income - expenseTotal)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Profit is reported only when expense data is complete.
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Income by payment method</h2>
        {Object.keys(byMethod).length === 0 ? (
          <p className="mt-3 text-sm text-muted">No paid payments recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {Object.entries(byMethod).map(([method, amount]) => {
              const pct = income > 0 ? Math.round((amount / income) * 100) : 0;
              return (
                <li key={method}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{method.replace("_", " ")}</span>
                    <span className="font-bold">{formatMoney(amount)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-pastel-pink">
                    <div className="h-full rounded-full bg-rose-gold" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
