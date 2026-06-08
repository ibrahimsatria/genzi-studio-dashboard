import { SignInForm } from "@/components/sign-in-form";
import Link from "next/link";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 20% 10%, rgba(212,165,116,.08), transparent 65%)," +
            "radial-gradient(50% 50% at 85% 80%, rgba(196,90,58,.06), transparent 70%)",
        }}
      />
      <div className="w-full max-w-sm">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-dim">
          Welcome back
        </span>
        <h1 className="mt-3 font-display text-3xl font-light leading-tight text-cream">
          Sign in to <em className="italic text-brass">Growth OS</em>
        </h1>

        <Suspense fallback={<div className="mt-8 h-44 animate-pulse rounded-lg bg-bg-2" />}>
          <SignInForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-cream-dim">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-brass hover:text-cream focus-visible:outline-none focus-visible:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
