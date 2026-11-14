// Role-based permission definitions.
// Server-side enforcement only — never rely on hiding UI buttons.

export const ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "RECEPTIONIST",
  "STAFF",
  "CUSTOMER",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  // Booking
  "booking:create",
  "booking:read:any",
  "booking:read:own",
  "booking:update:any",
  "booking:update:own",
  "booking:cancel:own",
  "booking:assign",
  "booking:checkin",
  // Services & packages
  "service:manage",
  "package:manage",
  "category:manage",
  // People
  "customer:read:any",
  "customer:manage",
  "staff:manage",
  "role:manage",
  // Operations
  "pos:use",
  "inventory:manage",
  "supplier:manage",
  "expense:manage",
  // Finance
  "payment:read:any",
  "payment:refund",
  "invoice:manage",
  "report:read",
  // Marketing
  "coupon:manage",
  "membership:manage",
  "giftcard:manage",
  "referral:manage",
  // Website
  "content:manage",
  "faq:manage",
  "gallery:manage",
  "testimonial:manage",
  // System
  "settings:manage",
  "audit:read",
  "notification:send",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

// Default permission matrix. Owner/Admin are always fully allowed.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [...PERMISSIONS],
  ADMIN: [...PERMISSIONS],
  MANAGER: [
    "booking:read:any",
    "booking:update:any",
    "booking:assign",
    "booking:checkin",
    "customer:read:any",
    "service:manage",
    "package:manage",
    "pos:use",
    "payment:read:any",
    "invoice:manage",
    "report:read",
    "coupon:manage",
    "giftcard:manage",
    "referral:manage",
    "content:manage",
    "faq:manage",
    "gallery:manage",
    "testimonial:manage",
    "notification:send",
  ],
  RECEPTIONIST: [
    "booking:create",
    "booking:read:any",
    "booking:update:any",
    "booking:assign",
    "booking:checkin",
    "customer:read:any",
    "customer:manage",
    "pos:use",
    "payment:read:any",
    "invoice:manage",
    "notification:send",
  ],
  STAFF: [
    "booking:read:own",
    "booking:update:own",
  ],
  CUSTOMER: [
    "booking:create",
    "booking:read:own",
    "booking:cancel:own",
  ],
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  if (role === "OWNER" || role === "ADMIN") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
