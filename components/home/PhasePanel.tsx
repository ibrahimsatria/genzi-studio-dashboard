"use client";

import { useMetrics } from "@/lib/metrics-store";
import { phaseStatus, type PhaseInfo } from "@/lib/phases";

function PhaseCard({ phase }: { phase: PhaseInfo }) {
  const pct = phase.need > 0 ? Math.min(100, (phase.have / phase.need) * 100) : 100;
  const locked = !phase.unlocked;

  return (
    <article
      className={[
        "relative overflow-hidden rounded-xl border p-5 transition-colors duration-200",
        locked
          ? "border-border-base bg-bg-2/60"
          : "border-brass/25 bg-brass/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div
          className={[
            "grid h-9 w-9 place-items-center rounded-full border font-display text-[16px] font-light",
            locked
              ? "border-border-soft bg-bg-3 text-cream-dim"
              : "border-green/40 bg-green/15 text-green",
          ].join(" ")}
        >
          {locked ? <span aria-hidden className="text-[13px]">🔒</span> : phase.n}
        </div>
        <span
          className={[
            "rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]",
            locked
              ? "border-border-soft text-cream-dim"
              : "border-green/25 bg-green/10 text-green",
          ].join(" ")}
        >
          {locked ? "Locked" : "Unlocked"}
        </span>
      </div>

      <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-brass-dim">
        Phase {phase.n} · {phase.time}
      </div>
      <h3 className="mt-1 text-[15px] font-medium text-cream">{phase.name}</h3>

      {phase.criterion && (
        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-cream-dim">
            <span>{locked ? phase.criterion : "Criterion met"}</span>
            <span className="tabular-nums">
              {Math.min(phase.have, phase.need)}/{phase.need}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-4">
            <div
              className={[
                "h-full rounded-full transition-[width] duration-700 ease-spring",
                locked ? "bg-brass-dim" : "bg-green",
              ].join(" ")}
              style={{ width: `${Math.max(3, pct)}%` }}
            />
          </div>
        </div>
      )}
      {!phase.criterion && (
        <div className="mt-3 font-mono text-[10px] text-green">Always open — start here.</div>
      )}
    </article>
  );
}

export function PhasePanel() {
  const metrics = useMetrics();
  const phases = phaseStatus(metrics);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {phases.map((p) => (
        <PhaseCard key={p.n} phase={p} />
      ))}
    </div>
  );
}
