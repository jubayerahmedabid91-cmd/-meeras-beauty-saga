import { prisma } from "@/lib/prisma";

export async function getFeaturedServices(limit = 6) {
  return prisma.service.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getServices(limit?: number) {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getFeaturedPackages(limit = 6) {
  return prisma.package.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPackages(limit?: number) {
  return prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGalleryImages(limit?: number) {
  return prisma.galleryImage.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getTestimonials(limit = 3) {
  return prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getTeamProfiles(limit?: number) {
  return prisma.teamProfile.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getFAQs(limit?: number) {
  return prisma.fAQ.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getCategories(limit?: number) {
  return prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getBusinessSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const row = await prisma.businessSetting.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}
