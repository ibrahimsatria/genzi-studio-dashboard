"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-dim">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-lg border border-border-base bg-bg-2 px-4 text-sm text-cream placeholder:text-cream-dim/60 focus:border-brass-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/40"
          placeholder="you@example.com"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-dim">
          Password
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-lg border border-border-base bg-bg-2 px-4 text-sm text-cream placeholder:text-cream-dim/60 focus:border-brass-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/40"
          placeholder="Your password"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-sienna-dim/40 bg-sienna/10 px-3 py-2 text-xs text-sienna">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-brass font-mono text-[11px] uppercase tracking-[0.16em] text-bg shadow-elev-2 transition-[transform,background-color] duration-200 ease-spring hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
