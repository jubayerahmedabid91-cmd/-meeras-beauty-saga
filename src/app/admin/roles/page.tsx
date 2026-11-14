import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ROLES, ROLE_PERMISSIONS, type Permission } from "@/lib/permissions";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Roles & Permissions" };

const PERM_LABELS: Record<string, string> = {
  "booking:create": "Create bookings",
  "booking:read:any": "View all bookings",
  "booking:read:own": "View own bookings",
  "booking:update:any": "Update any booking",
  "booking:update:own": "Update own bookings",
  "booking:cancel:own": "Cancel own bookings",
  "booking:assign": "Assign staff",
  "booking:checkin": "Check-in customers",
  "service:manage": "Manage services",
  "package:manage": "Manage packages",
  "category:manage": "Manage categories",
  "customer:read:any": "View all customers",
  "customer:manage": "Manage customers",
  "staff:manage": "Manage staff",
  "role:manage": "Manage roles",
  "pos:use": "Use POS",
  "inventory:manage": "Manage inventory",
  "supplier:manage": "Manage suppliers",
  "expense:manage": "Manage expenses",
  "payment:read:any": "View payments",
  "payment:refund": "Process refunds",
  "invoice:manage": "Manage invoices",
  "report:read": "View reports",
  "coupon:manage": "Manage coupons",
  "membership:manage": "Manage memberships",
  "giftcard:manage": "Manage gift cards",
  "referral:manage": "Manage referrals",
  "content:manage": "Manage website content",
  "faq:manage": "Manage FAQs",
  "gallery:manage": "Manage gallery",
  "testimonial:manage": "Manage testimonials",
  "settings:manage": "Manage settings",
  "audit:read": "View audit logs",
  "notification:send": "Send notifications",
};

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Roles &amp; Permissions</h1>
        <p className="mt-1 text-sm text-muted">
          Define what each role can access. Owner has full access.
        </p>
      </div>

      <div className="space-y-4">
        {ROLES.map((role) => (
          <div key={role} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold">{role}</h2>
                <p className="text-xs text-muted">
                  {role === "OWNER" || role === "ADMIN" ? "Full access" : `${ROLE_PERMISSIONS[role].length} permissions`}
                </p>
              </div>
            </div>
            {role !== "OWNER" && role !== "ADMIN" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ROLE_PERMISSIONS[role].map((p: Permission) => (
                  <span key={p} className="rounded-full bg-pastel-pink px-3 py-1 text-xs font-medium text-charcoal">
                    {PERM_LABELS[p] ?? p}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
