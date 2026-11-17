import { cache } from "react";
import { getBusinessSetting } from "@/lib/data";
import { BRAND } from "@/lib/brand";

/**
 * Single source of truth for the salon's public business information.
 *
 * Everything here is owner-configurable in the admin panel (General Settings /
 * Website -> Contact Information) and stored in the `business_settings` table.
 * The BRAND constants are only a fallback for first-run, and any placeholder
 * text ("To be provided by the owner") is treated as "not configured" so the
 * public website never shows unverified details.
 *
 * Cached per request via React cache() so multiple components can call it
 * without extra database round-trips.
 */

const PLACEHOLDER_PATTERN = /to be provided|placeholder|tbd|coming soon/i;

function clean(value: unknown): string {
  const s = String(value ?? "").trim();
  if (!s || PLACEHOLDER_PATTERN.test(s)) return "";
  return s;
}

type OpeningHours = Record<string, { open?: string; close?: string; isOff?: boolean }>;

function formatHours(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const hours = raw as OpeningHours;
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  // Group consecutive days with identical hours: "Mon – Sat · 10:00 AM – 8:00 PM".
  const to12h = (t?: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h)) return "";
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${String(m ?? 0).padStart(2, "0")} ${ampm}`;
  };

  const dayLabel = (d: string) => d.charAt(0).toUpperCase() + d.slice(1, 3);

  const groups: string[] = [];
  let i = 0;
  while (i < days.length) {
    const day = hours[days[i]] ?? {};
    const open = clean(day.open);
    const close = clean(day.close);
    const isOff = Boolean(day.isOff) || !open || !close;
    let j = i + 1;
    while (j < days.length) {
      const nd = hours[days[j]] ?? {};
      const nOpen = clean(nd.open);
      const nClose = clean(nd.close);
      const nOff = Boolean(nd.isOff) || !nOpen || !nClose;
      if (nOff !== isOff || (!isOff && (nOpen !== open || nClose !== close))) break;
      j++;
    }
    if (isOff) {
      if (j - i < days.length) groups.push(`${dayLabel(days[i])}: Closed`);
    } else {
      const label =
        j - i > 1 ? `${dayLabel(days[i])} – ${dayLabel(days[j - 1])}` : dayLabel(days[i]);
      groups.push(`${label} ${to12h(open)} – ${to12h(close)}`);
    }
    i = j;
  }
  return groups.join(" · ");
}

export type SalonProfile = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappDigits: string | null;
  email: string;
  currency: string;
  openingHours: string; // human-readable summary
  logoUrl: string; // "" => use the built-in brand mark
  social: { instagram: string; facebook: string; youtube: string; tiktok: string };
};

export const getSalonProfile = cache(async (): Promise<SalonProfile> => {
  const [address, phone, whatsapp, email, currency, openingHoursRaw, logoUrl, socialRaw] =
    await Promise.all([
      getBusinessSetting<string>("address", BRAND.contact.address),
      getBusinessSetting<string>("phone", BRAND.contact.phone),
      getBusinessSetting<string>("whatsapp", BRAND.contact.whatsapp),
      getBusinessSetting<string>("email", BRAND.contact.email),
      getBusinessSetting<string>("currency", "USD"),
      getBusinessSetting<unknown>("opening_hours", null),
      getBusinessSetting<string>("logo_url", ""),
      getBusinessSetting<unknown>("social", null),
    ]);

  const socialPart = (v: unknown, fallback: string) => {
    const s = clean(v);
    return s || fallback;
  };

  const social =
    socialRaw && typeof socialRaw === "object"
      ? (socialRaw as Record<string, unknown>)
      : {};

  const digits = clean(whatsapp).replace(/\D/g, "");
  const waValid = digits.length >= 8 && digits.length <= 15 && !/^0+$/.test(digits);

  return {
    name: clean(BRAND.name),
    tagline: clean(BRAND.tagline),
    address: clean(address),
    phone: clean(phone),
    whatsapp: clean(whatsapp),
    whatsappDigits: waValid ? digits : null,
    email: clean(email),
    currency: clean(currency) || "USD",
    openingHours: formatHours(openingHoursRaw),
    logoUrl: clean(logoUrl),
    social: {
      instagram: socialPart(social.instagram, BRAND.social.instagram),
      facebook: socialPart(social.facebook, BRAND.social.facebook),
      youtube: socialPart(social.youtube, BRAND.social.youtube),
      tiktok: socialPart(social.tiktok, BRAND.social.tiktok),
    },
  };
});
