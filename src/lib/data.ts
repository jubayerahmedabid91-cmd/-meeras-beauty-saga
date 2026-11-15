import { prisma } from "@/lib/prisma";

/**
 * Runs a read query and falls back to an empty result set instead of letting a
 * storage failure (read-only filesystem, cold start, missing engine) crash the
 * whole page with a 500.
 */
async function guarded<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[data] ${label} failed, using fallback:`, error);
    return [] as unknown as T;
  }
}

export async function getFeaturedServices(limit = 6) {
  return guarded(() => prisma.service.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { category: true },
  }), "getFeaturedServices");
}

export async function getServices(limit?: number) {
  return guarded(() => prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { category: true },
  }), "getServices");
}

export async function getFeaturedPackages(limit = 6) {
  return guarded(() => prisma.package.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  }), "getFeaturedPackages");
}

export async function getPackages(limit?: number) {
  return guarded(() => prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  }), "getPackages");
}

export async function getGalleryImages(limit?: number) {
  return guarded(() => prisma.galleryImage.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  }), "getGalleryImages");
}

export async function getTestimonials(limit = 3) {
  return guarded(() => prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  }), "getTestimonials");
}

export async function getTeamProfiles(limit?: number) {
  return guarded(() => prisma.teamProfile.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  }), "getTeamProfiles");
}

export async function getFAQs(limit?: number) {
  return guarded(() => prisma.fAQ.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  }), "getFAQs");
}

export async function getCategories(limit?: number) {
  return guarded(() => prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  }), "getCategories");
}

export async function getBusinessSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.businessSetting.findUnique({ where: { key } });
    if (!row) return fallback;
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return fallback;
    }
  } catch (error) {
    console.error(`[data] getBusinessSetting(${key}) failed, using fallback:`, error);
    return fallback;
  }
}
