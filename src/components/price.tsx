"use client";

import { formatMoney } from "@/lib/utils";
import { useCurrency } from "./currency-provider";

/**
 * Renders a price in the salon's configured currency.
 * Use this instead of calling formatMoney() directly so a currency change in
 * Admin -> Settings immediately updates every price on the site.
 */
export function Price({
  cents,
  className,
  currency,
}: {
  cents: number;
  className?: string;
  /** Override the configured currency (rarely needed). */
  currency?: string;
}) {
  const configured = useCurrency();
  return (
    <span className={className}>{formatMoney(cents, currency ?? configured)}</span>
  );
}
