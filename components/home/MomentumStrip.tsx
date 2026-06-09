"use client";

import { useProgress } from "@/lib/progress-store";
import { useMetrics } from "@/lib/metrics-store";
import { nextUnlock } from "@/lib/phases";
import { progressToNext } from "@/lib/xp";
import { taskById } from "@/content/tasks";

export function MomentumStrip() {
  const progress = useProgress();
  const metrics = useMetrics();

  const recent = progress.checkedTasks
    .slice(-3)
    .reverse()
    .map(taskById)
    .filter((t): t is NonNullable<ReturnType<typeof taskById>> => t !== null);

  const locked = nextUnlock(metrics);
  const { next, pct } = progressToNext(progress.xp);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Recently completed */}
      <section className="rounded-xl border border-border-base bg-bg-2 p-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-brass-dim">
          Recently completed
        </div>
        {recent.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {recent.map((r, i) => (
              <li key={`${r.panelId}:${r.index}:${i}`} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-green/20 text-[9px] text-green">
                  ✓
                </span>
                <span className="text-[13px] leading-snug text-cream-mid">{r.task.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13px] leading-snug text-cream-dim">
            Nothing yet — check off your first action above and it&apos;ll show up here as momentum.
          </p>
        )}
      </section>

      {/* What unlocks next */}
      <section className="relative overflow-hidden rounded-xl border border-brass/25 bg-brass/[0.04] p-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-brass-dim">
          What unlocks next
        </div>
        {locked ? (
          <>
            <h3 className="mt-2 text-[15px] font-medium text-cream">
              Phase {locked.n}: {locked.name}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-cream-mid">
              {locked.criterion} — {Math.min(locked.have, locked.need)} of {locked.need} so far.
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-700 ease-spring"
                style={{ width: `${Math.max(3, Math.min(100, (locked.have / locked.need) * 100))}%` }}
              />
            </div>
          </>
        ) : next ? (
          <>
            <h3 className="mt-2 text-[15px] font-medium text-cream">
              Level up to {next.name}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-cream-mid">
              All phases unlocked. {next.need - progress.xp} XP to your next level.
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-700 ease-spring"
                style={{ width: `${Math.max(3, pct)}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-2 text-[15px] font-medium text-cream">Everything unlocked</h3>
            <p className="mt-1 text-[13px] leading-snug text-cream-mid">
              Max level, all phases open. Now it&apos;s all repetition and refinement.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
