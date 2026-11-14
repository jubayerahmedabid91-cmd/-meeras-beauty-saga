import type { Metadata } from "next";
import { LineChart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Financial Reports" };

export default async function AdminFinancialReportsPage() {
  const payments = await prisma.payment.findMany({ where: { status: "PAID" } });
  const expenses = await prisma.expense.findMany();

  const income = payments.reduce((s, p) => s + p.amountCents, 0);
  const expense = expenses.reduce((s, e) => s + e.amountCents, 0);

  const byCategory: Record<string, number> = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amountCents;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Financial Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Summary of income, expenses and net position. Profit is reported only when expense data is
          complete.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Income</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{formatMoney(income)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Expenses</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">{formatMoney(expense)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Net</p>
          <p className={`mt-2 text-2xl font-bold ${income - expense >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatMoney(income - expense)}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold">Expenses by category</h2>
        {Object.keys(byCategory).length === 0 ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <LineChart className="h-4 w-4 text-rose-gold" />
            No expenses recorded.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {Object.entries(byCategory).map(([cat, amount]) => {
              const pct = expense > 0 ? Math.round((amount / expense) * 100) : 0;
              return (
                <li key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat}</span>
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
