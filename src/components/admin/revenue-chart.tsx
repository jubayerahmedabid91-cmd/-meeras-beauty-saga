"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TrendPoint = {
  label: string;
  revenue: number;
  bookings: number;
};

const money = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

export function RevenueChart({ data }: { data: TrendPoint[] }) {
  const [mode, setMode] = useState<"revenue" | "bookings">("revenue");

  const points = useMemo(
    () => data.map((d) => ({ ...d, revenue: d.revenue / 100 })),
    [data],
  );

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Revenue &amp; bookings trend</h2>
          <p className="text-xs text-muted">Paid revenue against booked appointments.</p>
        </div>
        <div className="flex rounded-full bg-pastel-pink p-0.5 text-xs font-semibold">
          {(["revenue", "bookings"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                "rounded-full px-4 py-1.5 capitalize transition " +
                (mode === m ? "bg-white text-rose-gold shadow-soft" : "text-muted hover:text-charcoal")
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B76E79" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#B76E79" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E14" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
              tickLine={false}
              axisLine={{ stroke: "#2E2E2E1A" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (mode === "revenue" ? `$${money(Number(v))}` : String(v))}
            />
            <Tooltip
              cursor={{ fill: "#B76E7914" }}
              formatter={(value, name) => [
                name === "revenue" ? `$${money(Number(value))}` : value,
                name === "revenue" ? "Revenue" : "Bookings",
              ]}
              contentStyle={{
                borderRadius: 14,
                border: "1px solid #2E2E2E1A",
                fontSize: 12,
                boxShadow: "0 12px 40px rgba(46,46,46,0.14)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {mode === "revenue" ? (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#B76E79"
                strokeWidth={2.5}
                fill="url(#revFill)"
                name="Revenue"
              />
            ) : (
              <Bar dataKey="bookings" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Bookings" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
