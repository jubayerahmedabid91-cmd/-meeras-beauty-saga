import { cache } from "react";
import { getBusinessSetting } from "@/lib/data";

export type Claims = {
  /** Trained, certified specialists for every service. */
  certifiedArtists: boolean;
  /** Only genuine, salon-grade products. */
  authenticProducts: boolean;
  /** Private, sanitised bridal suite. */
  hygienicSuite: boolean;
  /** Hundreds of brides served. */
  happyBrides: boolean;
};

/**
 * Unverified marketing claims are OFF by default.
 *
 * The public website must never present a claim (certifications, product
 * authenticity, suite hygiene, customer counts) as fact unless the salon
 * owner has explicitly confirmed it in Admin -> Settings -> Website claims.
 */
export const CLAIM_KEYS: (keyof Claims)[] = [
  "certifiedArtists",
  "authenticProducts",
  "hygienicSuite",
  "happyBrides",
];

const OFF: Claims = {
  certifiedArtists: false,
  authenticProducts: false,
  hygienicSuite: false,
  happyBrides: false,
};

export const getClaims = cache(async (): Promise<Claims> => {
  const raw = await getBusinessSetting<Partial<Claims> | null>("claims", null);
  if (!raw || typeof raw !== "object") return OFF;
  return {
    certifiedArtists: raw.certifiedArtists === true,
    authenticProducts: raw.authenticProducts === true,
    hygienicSuite: raw.hygienicSuite === true,
    happyBrides: raw.happyBrides === true,
  };
});
