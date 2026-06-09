import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative flex flex-1 min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* layered ambient gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, rgba(212,165,116,.10), transparent 65%)," +
            "radial-gradient(50% 50% at 85% 80%, rgba(196,90,58,.08), transparent 70%)," +
            "radial-gradient(80% 80% at 50% 100%, rgba(13,11,9,.6), transparent 65%)",
        }}
      />

      <section className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass-dim">
          Genzi Studio · Growth OS
        </span>

        <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4rem)] font-light leading-[1.05] tracking-[-0.02em] text-cream">
          Build a Brunei agency from{" "}
          <em className="font-light italic text-brass">zero proof</em>, one section at a time.
        </h1>

        <p className="mt-6 max-w-xl text-balance text-[15px] leading-[1.8] text-cream-mid">
          A gamified strategy dashboard for solo founders. Earn XP as you work
          through roadmap, portfolio, pricing, spec work, personal brand, and
          outreach. Progress syncs across every device you sign in on.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brass px-8 font-mono text-[11px] uppercase tracking-[0.16em] text-bg shadow-elev-2 transition-[transform,background-color] duration-200 ease-spring hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass active:scale-[0.98]"
          >
            Start free
            <span aria-hidden className="transition-transform duration-200 ease-spring group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border-soft px-8 font-mono text-[11px] uppercase tracking-[0.16em] text-cream-mid transition-[transform,border-color,color] duration-200 ease-spring hover:border-brass-dim hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass active:scale-[0.98]"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-cream-dim">
          Made in BSB, Brunei Darussalam
        </p>
      </section>
    </main>
  );
}
