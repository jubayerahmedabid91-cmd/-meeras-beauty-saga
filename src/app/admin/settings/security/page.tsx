import type { Metadata } from "next";
import { Lock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Security" };

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Security</h1>
        <p className="mt-1 text-sm text-muted">Account security and access controls.</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <Lock className="h-5 w-5" />
          </span>
          <h2 className="font-bold">Password policy</h2>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Minimum 8 characters required for all accounts.</li>
          <li>Passwords are hashed with bcrypt (12 rounds).</li>
          <li>Staff accounts are created by the owner or admin.</li>
        </ul>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h2 className="font-bold">Role-based access</h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Permissions are enforced on the server for every admin action. Roles and their permissions
          can be reviewed under Roles &amp; Permissions.
        </p>
      </div>
    </div>
  );
}
