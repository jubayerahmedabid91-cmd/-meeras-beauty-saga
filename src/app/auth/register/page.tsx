import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";
import { LogoWordmark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Meera's - The Beauty Saga customer account.",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/customer");

  return (
    <section className="pattern-surface flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="container-site">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <LogoWordmark compact />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-sm text-muted">
              Book appointments, track your visits and enjoy member benefits.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <a href="/auth/login" className="font-semibold text-rose-gold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
