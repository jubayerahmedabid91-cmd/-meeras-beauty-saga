import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FAQS,
  DEFAULT_GALLERY,
  DEFAULT_PACKAGES,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM,
  DEFAULT_TESTIMONIALS,
} from "./default-data";

/**
 * Runs a read query and falls back to the built-in default content instead of
 * letting a storage failure (native addon cannot load, read-only filesystem,
 * cold start) crash the page with a 500.
 */
async function guarded<T>(fn: () => Promise<T>, label: string, fallback: unknown): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[data] ${label} failed, using default content:`, error);
    return fallback as T;
  }
}

export async function getFeaturedServices(limit = 6) {
  return guarded(
    () =>
      prisma.service.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
        include: { category: true },
      }),
    "getFeaturedServices",
    DEFAULT_SERVICES.filter((s) => s.isFeatured).slice(0, limit)
  );
}

export async function getServices(limit?: number) {
  return guarded(
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
        include: { category: true },
      }),
    "getServices",
    limit ? DEFAULT_SERVICES.slice(0, limit) : DEFAULT_SERVICES
  );
}

export async function getFeaturedPackages(limit = 6) {
  return guarded(
    () =>
      prisma.package.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    "getFeaturedPackages",
    DEFAULT_PACKAGES.filter((p) => p.isFeatured).slice(0, limit)
  );
}

export async function getPackages(limit?: number) {
  return guarded(
    () =>
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    "getPackages",
    limit ? DEFAULT_PACKAGES.slice(0, limit) : DEFAULT_PACKAGES
  );
}

export async function getGalleryImages(limit?: number) {
  return guarded(
    () =>
      prisma.galleryImage.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
      }),
    "getGalleryImages",
    limit ? DEFAULT_GALLERY.slice(0, limit) : DEFAULT_GALLERY
  );
}

export async function getTestimonials(limit = 3) {
  return guarded(
    () =>
      // Only owner-curated testimonials are shown publicly — seeded sample
      // content (source = 'SAMPLE') is never displayed as real customer reviews.
      prisma.testimonial.findMany({
        where: { isVisible: true, source: "OWNER" },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    "getTestimonials",
    [] // never fall back to sample reviews
  );
}

export async function getTeamProfiles(limit?: number) {
  return guarded(
    () =>
      prisma.teamProfile.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
      }),
    "getTeamProfiles",
    limit ? DEFAULT_TEAM.slice(0, limit) : DEFAULT_TEAM
  );
}

export async function getFAQs(limit?: number) {
  return guarded(
    () =>
      prisma.fAQ.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
      }),
    "getFAQs",
    limit ? DEFAULT_FAQS.slice(0, limit) : DEFAULT_FAQS
  );
}

export async function getCategories(limit?: number) {
  return guarded(
    () =>
      prisma.serviceCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
      }),
    "getCategories",
    limit ? DEFAULT_CATEGORIES.slice(0, limit) : DEFAULT_CATEGORIES
  );
}

export async function getBusinessSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.businessSetting.findUnique({ where: { key } });
    if (!row) return readDefaultSetting(key, fallback);
    try {
      return JSON.parse(row.value) as T;
    } catch {
      // Settings saved through the admin forms are stored as plain strings
      // (e.g. currency "BDT", a phone number, an address). Only structured
      // values are JSON-encoded, so a parse failure means "plain string".
      return row.value as unknown as T;
    }
  } catch (error) {
    console.error(`[data] getBusinessSetting(${key}) failed, using default:`, error);
    return readDefaultSetting(key, fallback);
  }
}

function readDefaultSetting<T>(key: string, fallback: T): T {
  const raw = (DEFAULT_SETTINGS as Record<string, unknown>)[key];
  if (raw === undefined) return fallback;
  try {
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Resolves the salon's WhatsApp number (env override wins over the
 * owner-configurable business setting). Returns digits only, or null when no
 * valid number is configured — we never invent one.
 */
export async function getWhatsAppDigits(): Promise<string | null> {
  const setting = (await getBusinessSetting<string>("whatsapp", "")) ?? "";
  const raw = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || String(setting).trim();
  const digits = raw.replace(/\D/g, "");
  const valid = digits.length >= 8 && digits.length <= 15 && !/^0+$/.test(digits);
  return valid ? digits : null;
}
