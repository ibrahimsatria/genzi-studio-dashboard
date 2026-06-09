"use client";

import { useState } from "react";
import { useRhythm, useRhythmActions } from "@/lib/rhythm-store";
import { elapsedSince, fmtDate } from "@/lib/rhythm-derive";

const BUCKETS = [
  { label: "Month 0 – 1", short: "Build proof" },
  { label: "Month 1 – 3", short: "Activate" },
  { label: "Month 3+", short: "Scale" },
];

function bucketIndex(monthIndex: number): number {
  if (monthIndex < 1) return 0;
  if (monthIndex < 3) return 1;
  return 2;
}

export function TimeIndicator() {
  const { startedAt } = useRhythm();
  const { setStartedAt } = useRhythmActions();
  const e = elapsedSince(startedAt);
  const active = bucketIndex(e.monthIndex);

  const [editing, setEditing] = useState(false);

  // Position along the first-90-day arc; pins at 100% after Month 3.
  const arcPct = Math.min(100, (e.days / 90) * 100);

  return (
    <section className="rounded-xl border border-border-base bg-bg-2 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-brass-dim">
            Where you are in time
          </div>
          <div className="mt-1.5 font-display text-[clamp(1.4rem,4vw,1.8rem)] font-light leading-none text-cream">
            {BUCKETS[active].label}
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-cream-dim">
            Day {e.days} · started {fmtDate(e.startedAt)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream-dim underline decoration-border-soft underline-offset-4 transition-colors duration-150 hover:text-brass"
        >
          {editing ? "Close" : "Adjust start"}
        </button>
      </div>

      {editing && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border-base bg-bg-3/60 p-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream-dim">
            Journey start
          </label>
          <input
            type="date"
            defaultValue={fmtDate(e.startedAt)}
            max={fmtDate(new Date())}
            onChange={(ev) => {
              if (ev.target.value) setStartedAt(new Date(`${ev.target.value}T00:00:00`).toISOString());
            }}
            className="rounded-md border border-border-base bg-bg-3 px-2.5 py-1.5 font-mono text-[12px] text-cream focus-visible:border-brass-dim"
          />
          <span className="font-mono text-[10px] text-cream-dim">Sets your Month 0.</span>
        </div>
      )}

      {/* Three-phase arc */}
      <div className="relative mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-700 ease-spring"
            style={{ width: `${Math.max(3, arcPct)}%` }}
          />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {BUCKETS.map((b, i) => (
            <div
              key={b.label}
              className={[
                "rounded-md border px-2.5 py-2 text-center transition-colors duration-200",
                i === active
                  ? "border-brass/35 bg-brass/[0.06]"
                  : "border-border-base",
              ].join(" ")}
            >
              <div
                className={[
                  "font-mono text-[9px] uppercase tracking-[0.08em]",
                  i === active ? "text-brass" : "text-cream-dim",
                ].join(" ")}
              >
                {b.label}
              </div>
              <div
                className={[
                  "mt-0.5 text-[11px]",
                  i === active ? "text-cream" : "text-cream-dim",
                ].join(" ")}
              >
                {b.short}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
