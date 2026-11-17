import type { Metadata } from "next";
import Link from "next/link";
import { LogoWordmark } from "@/components/logo";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <section className="pattern-surface flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="container-site">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <LogoWordmark compact />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Set a new password</h1>
            <p className="mt-2 text-sm text-muted">
              Use the link from your email to choose a new password.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            <p className="text-sm text-muted">
              Password reset links are generated when you request them from the forgot password page.
              If you have a reset link, open it to set your new password.
            </p>
            <Link href="/auth/forgot-password" className="btn-primary mt-4 w-full">
              Go to forgot password
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
