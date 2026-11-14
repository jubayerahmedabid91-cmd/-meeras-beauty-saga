import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { LogoWordmark } from "@/components/logo";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Meera's - The Beauty Saga account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    const dest =
      session.user.role === "OWNER" || session.user.role === "ADMIN" || session.user.role === "MANAGER"
        ? "/admin"
        : session.user.role === "STAFF"
          ? "/staff"
          : "/customer";
    redirect(dest);
  }

  const { callbackUrl, error } = await searchParams;

  return (
    <section className="pattern-surface flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="container-site">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <LogoWordmark compact />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to manage your bookings and account.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error === "CredentialsSignin"
                  ? "Invalid email or password. Please try again."
                  : "Something went wrong. Please try again."}
              </div>
            )}
            <LoginForm callbackUrl={callbackUrl} />
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Don&rsquo;t have an account?{" "}
            <a href="/auth/register" className="font-semibold text-rose-gold hover:underline">
              Create one
            </a>
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            Demo accounts: owner@meerasdemo.com / staff@meerasdemo.com / customer@meerasdemo.com
          </p>
        </div>
      </div>
    </section>
  );
}
