import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "New Membership" };

export default function AdminNewMembershipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">New Membership</h1>
        <p className="mt-1 text-sm text-muted">Create a membership tier.</p>
      </div>

      <EmptyState
        icon={<Crown className="h-6 w-6" />}
        title="Membership builder"
        description="Membership creation will be available once membership settings are configured."
      />
    </div>
  );
}
