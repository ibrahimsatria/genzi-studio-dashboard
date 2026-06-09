"use client";

import { useMetrics } from "@/lib/metrics-store";
import { headlineMetrics, formatBND } from "@/lib/metrics-derive";
import { PORTFOLIO_GOAL_MIN, PORTFOLIO_GOAL_MAX } from "@/lib/metrics-types";
import { useCountUp } from "@/lib/use-count-up";

function StatCard({
  eyebrow,
  value,
  display,
  sub,
  accent,
}: {
  eyebrow: string;
  value: number;
  display?: (n: number) => string;
  sub: string;
  accent: "brass" | "sienna" | "green";
}) {
  const animated = useCountUp(value);
  const rounded = Math.round(animated);
  const text = display ? display(rounded) : String(rounded);
  const accentCls = {
    brass: "text-brass",
    sienna: "text-sienna",
    green: "text-green",
  }[accent];

  return (
    <article className="relative overflow-hidden rounded-xl border border-border-base bg-bg-2 p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.07]"
        style={{
          background:
            accent === "sienna"
              ? "radial-gradient(circle, var(--sienna), transparent 70%)"
              : accent === "green"
                ? "radial-gradient(circle, var(--green), transparent 70%)"
                : "radial-gradient(circle, var(--brass), transparent 70%)",
        }}
      />
      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-brass-dim">
        {eyebrow}
      </div>
      <div
        className={`mt-2 font-display text-[clamp(1.9rem,5vw,2.4rem)] font-light leading-none tabular-nums ${accentCls}`}
      >
        {text}
      </div>
      <div className="mt-2 text-[12px] leading-snug text-cream-dim">{sub}</div>
    </article>
  );
}

export function MetricCounters() {
  const data = useMetrics();
  const m = headlineMetrics(data);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        eyebrow="Clients won"
        value={m.clients}
        sub={m.clients === 0 ? "Close your first deal to start" : "Deals closed from pipeline"}
        accent="green"
      />
      <StatCard
        eyebrow="Portfolio shipped"
        value={m.portfolioShipped}
        display={(n) => `${n} / ${PORTFOLIO_GOAL_MAX}`}
        sub={`Toward the ${PORTFOLIO_GOAL_MIN}–${PORTFOLIO_GOAL_MAX} piece goal`}
        accent="brass"
      />
      <StatCard
        eyebrow="Revenue · BND"
        value={m.revenueTotal}
        display={(n) => formatBND(n)}
        sub={`BND ${formatBND(m.revenueMonth)} this month`}
        accent="sienna"
      />
    </div>
  );
}
