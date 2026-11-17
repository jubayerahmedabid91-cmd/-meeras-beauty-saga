"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const CurrencyContext = createContext<string>("USD");

/**
 * Makes the salon's configured currency available to every price component.
 *
 * The value is read once per request in the (site) layout (from the
 * `business_settings` table) and provided here, so client components such as
 * the booking wizard format money with the right currency too.
 */
export function CurrencyProvider({
  currency,
  children,
}: {
  currency: string;
  children: ReactNode;
}) {
  const value = useMemo(() => currency || "USD", [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): string {
  return useContext(CurrencyContext);
}
