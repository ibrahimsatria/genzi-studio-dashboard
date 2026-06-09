"use client";

import { useRhythm, useRhythmActions } from "@/lib/rhythm-store";
import { rhythmStreaks } from "@/lib/rhythm-derive";
import { HABITS, type HabitKey } from "@/lib/rhythm-types";
import { useEffects } from "@/components/shell/Effects";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import type { HabitStreak } from "@/lib/rhythm-derive";

function HabitRow({
  habitKey,
  streak,
}: {
  habitKey: HabitKey;
  streak: HabitStreak;
}) {
  const def = HABITS.find((h) => h.key === habitKey)!;
  const { logHabit, unlogHabit } = useRhythmActions();
  const effects = useEffects();
  const toast = useToast();

  const onLog = (ev: React.MouseEvent) => {
    const willComplete = streak.thisWeekCount + 1 === streak.target;
    logHabit(habitKey);
    if (willComplete) {
      sound.section();
      effects.burst(ev.clientX, ev.clientY);
      toast("Weekly rhythm hit", `${def.label} · ${streak.current + 1}-week streak`);
    } else {
      sound.check();
      effects.burst(ev.clientX, ev.clientY);
    }
  };

  const pips = Math.max(streak.target, streak.thisWeekCount);

  return (
    <div className="border-b border-border-base px-5 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-cream">{def.label}</span>
            {streak.current > 0 && (
              <span className="rounded-full border border-sienna/30 bg-sienna/10 px-2 py-0.5 font-mono text-[9px] text-sienna">
                🔥 {streak.current}w
              </span>
            )}
            {streak.complete && (
              <span className="rounded-full bg-green/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-green">
                done
              </span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-[10px] leading-snug text-cream-dim">{def.hint}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => unlogHabit(habitKey)}
            disabled={streak.thisWeekCount === 0}
            aria-label={`Remove one ${def.unit}`}
            className="grid h-7 w-7 place-items-center rounded-md border border-border-base font-mono text-cream-dim transition-[transform,border-color,color] duration-150 ease-spring hover:border-brass-dim hover:text-brass active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border-base disabled:hover:text-cream-dim"
          >
            −
          </button>
          <button
            type="button"
            onClick={onLog}
            className="inline-flex items-center gap-1.5 rounded-md border border-brass/30 bg-brass/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-brass transition-[transform,background-color,border-color] duration-150 ease-spring hover:border-brass/50 hover:bg-brass/15 active:scale-95"
          >
            ＋ {def.verb}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: pips }).map((_, i) => {
            const filled = i < streak.thisWeekCount;
            const beyond = i >= streak.target;
            return (
              <div
                key={i}
                className="h-2 flex-1 rounded-full transition-[background-color] duration-300"
                style={{
                  background: filled
                    ? beyond
                      ? "var(--green)"
                      : "linear-gradient(90deg, var(--sienna), var(--brass))"
                    : "var(--bg4)",
                }}
              />
            );
          })}
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream-dim">
          {streak.thisWeekCount}/{streak.target} · best {streak.best}w
        </span>
      </div>
    </div>
  );
}

export function RhythmStreaks() {
  const data = useRhythm();
  const streaks = rhythmStreaks(data);

  return (
    <section className="overflow-hidden rounded-xl border border-border-base bg-bg-2">
      <div className="border-b border-border-base px-5 py-4">
        <h3 className="font-display text-[17px] font-light text-cream">Weekly rhythm</h3>
        <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
          Consistency is the habit that compounds — log it to keep the streak alive
        </p>
      </div>
      {HABITS.map((h) => (
        <HabitRow key={h.key} habitKey={h.key} streak={streaks[h.key]} />
      ))}
    </section>
  );
}
