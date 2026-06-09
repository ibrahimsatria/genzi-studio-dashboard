"use client";

import { useState, type ReactNode } from "react";
import { useMetrics } from "@/lib/metrics-store";
import { phaseStatus } from "@/lib/phases";
import { sound } from "@/lib/audio";

// Dynamic version of the static PhaseRow primitive: reflects real lock state
// derived from outcomes (portfolio shipped, clients won).
export function RoadmapPhaseRow() {
  const phases = phaseStatus(useMetrics());

  return (
    <div className="relative mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        aria-hidden
        className="absolute left-[16%] right-[16%] top-9 hidden h-px opacity-40 sm:block"
        style={{ background: "linear-gradient(90deg, var(--brass-dim), var(--border-light))" }}
      />
      {phases.map((p) => {
        const unlocked = p.unlocked;
        return (
          <div key={p.n} className="relative px-2.5 text-center">
            <div
              className={[
                "mx-auto mb-3.5 grid h-[72px] w-[72px] place-items-center rounded-full border font-display text-[22px] font-light transition-all duration-300",
                unlocked
                  ? "border-green/40 bg-green/15 text-green shadow-[0_0_24px_rgba(90,170,114,.15)]"
                  : "border-border-soft bg-bg-3 text-cream-dim",
              ].join(" ")}
            >
              {unlocked ? p.n : <span aria-hidden className="text-[20px]">🔒</span>}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-cream-dim">
              {p.span}
            </div>
            <div className="mt-1 text-[15px] font-medium text-cream">{p.name}</div>
            <div className="mt-0.5 font-mono text-[11px] text-brass-dim">{p.time}</div>
            {!unlocked && p.criterion && (
              <div className="mt-1.5 font-mono text-[10px] text-cream-dim">
                Unlock: {p.criterion} ({Math.min(p.have, p.need)}/{p.need})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Gate that hides a phase's detail until its criterion is met. Not a hard wall —
// a "Preview anyway" escape keeps the playbook readable while still making the
// "each phase unlocks the next" promise visible and real.
export function PhaseGate({
  phase,
  children,
}: {
  phase: 2 | 3;
  children: ReactNode;
}) {
  const phases = phaseStatus(useMetrics());
  const info = phases.find((p) => p.n === phase)!;
  const [preview, setPreview] = useState(false);

  if (info.unlocked || preview) {
    return (
      <>
        {!info.unlocked && preview && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border-soft bg-bg-3/60 px-4 py-2.5">
            <span className="font-mono text-[10px] text-cream-dim">
              Previewing a locked phase — unlock by: {info.criterion} ({Math.min(info.have, info.need)}/{info.need})
            </span>
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream-dim underline decoration-border-soft underline-offset-4 hover:text-brass"
            >
              Hide
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  const pct = Math.min(100, (info.have / info.need) * 100);

  return (
    <div className="mb-2.5 overflow-hidden rounded-xl border border-border-base bg-bg-2 p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-soft bg-bg-3 text-[18px]">
          <span aria-hidden>🔒</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-medium text-cream">
            Phase {info.n}: {info.name} is locked
          </h3>
          <p className="mt-1 text-[13px] leading-[1.7] text-cream-mid">
            This unlocks when you <strong className="text-cream">{info.criterion?.toLowerCase()}</strong>.
            You&apos;re at {Math.min(info.have, info.need)} of {info.need}. Keep your focus on the
            current phase — earning it is the point.
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-4">
            <div
              className="h-full rounded-full bg-brass-dim transition-[width] duration-700 ease-spring"
              style={{ width: `${Math.max(3, pct)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPreview(true);
              sound.exp();
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border-base px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cream-dim transition-[border-color,color] duration-150 hover:border-brass-dim hover:text-brass"
          >
            Preview anyway →
          </button>
        </div>
      </div>
    </div>
  );
}
