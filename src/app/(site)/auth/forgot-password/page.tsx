import type { Metadata } from "next";
import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <section className="pattern-surface flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="container-site">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <LogoWordmark compact />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Reset your password</h1>
            <p className="mt-2 text-sm text-muted">
              Enter your email and we will send you a reset link.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Remembered it?{" "}
            <Link href="/auth/login" className="font-semibold text-rose-gold hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
