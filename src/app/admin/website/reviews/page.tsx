import type { Metadata } from "next";
import Link from "next/link";
import { Star, MessageSquareQuote, ArrowLeft, CheckCircle2, Clock3, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth";
import { roleHasPermission, type Role } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";

export const metadata: Metadata = { title: "Customer Reviews" };

type Filter = "pending" | "approved" | "all";

const TABS: { key: Filter; label: string; icon: typeof Layers }[] = [
  { key: "pending", label: "Pending approval", icon: Clock3 },
  { key: "approved", label: "Approved", icon: CheckCircle2 },
  { key: "all", label: "All reviews", icon: Layers },
];

export default async function AdminCustomerReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter: Filter = status === "approved" || status === "all" ? status : "pending";

  // Only OWNER / ADMIN may approve (the API enforces the same rule).
  const session = await safeAuth();
  const role = ((session?.user as { role?: string } | undefined)?.role ?? "CUSTOMER") as Role;
  const canModerate = roleHasPermission(role, "testimonial:manage");

  const where =
    filter === "pending"
      ? { isApproved: false }
      : filter === "approved"
        ? { isApproved: true }
        : {};

  const [reviews, pendingCount, approvedCount, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { include: { user: { select: { email: true } } } },
        booking: { include: { service: true, package: true } },
      },
    }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.review.count(),
  ]);

  const counts: Record<Filter, number> = { pending: pendingCount, approved: approvedCount, all: totalCount };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/website"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Website Content
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Customer Reviews</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Reviews submitted by clients for completed bookings. A review only appears on the
          public website after it is approved here — approving publishes it as a public
          testimonial, and hiding it removes it again. Seeded sample testimonials are never
          shown publicly and are unaffected.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/website/reviews?status=${tab.key}`}
            aria-current={filter === tab.key ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === tab.key
                ? "bg-rose-gold text-white shadow-sm"
                : "bg-pastel-pink text-charcoal hover:bg-rose-gold-light"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            <span className={filter === tab.key ? "text-white/90" : "text-muted"}>
              ({counts[tab.key]})
            </span>
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquareQuote className="h-6 w-6" />}
          title={filter === "pending" ? "Nothing pending" : "No reviews yet"}
          description={
            filter === "pending"
              ? "New client reviews will appear here for approval."
              : "Client reviews for completed bookings will appear here."
          }
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const customerName = `${review.customer.firstName} ${review.customer.lastName}`.trim();
            const itemName =
              review.booking.service?.name ?? review.booking.package?.name ?? "Appointment";
            return (
              <article key={review.id} className="card p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{customerName}</p>
                      <Badge tone={review.isApproved ? "charcoal" : "outline"}>
                        {review.isApproved ? "Published" : "Pending"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{review.customer.user.email}</p>
                    <div
                      className="mt-2 flex items-center gap-0.5 text-rose-gold"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-rose-gold" : "fill-charcoal/10 text-charcoal/10"}`}
                        />
                      ))}
                    </div>
                    {review.comment ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="mt-2 text-xs italic text-muted">No written comment.</p>
                    )}
                    <p className="mt-2 text-[0.7rem] text-muted">
                      Booking #{review.booking.bookingNumber} · {itemName} · Completed{" "}
                      {formatDate(review.booking.startsAt)} · Submitted {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <ReviewModerationActions
                    reviewId={review.id}
                    isApproved={review.isApproved}
                    canModerate={canModerate}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
