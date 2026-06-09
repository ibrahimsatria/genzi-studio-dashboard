// Pure week-math, streak, and elapsed-time helpers. No React, no I/O.

import {
  type HabitKey,
  type HabitWeek,
  type RhythmData,
  habitDef,
} from "@/lib/rhythm-types";

// ─── week math (Monday-anchored, date-only) ─────────────────────────────────

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function mondayOf(d: Date): Date {
  const x = dateOnly(d);
  const dow = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - dow);
  return x;
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function currentWeekStart(): string {
  return fmtDate(mondayOf(new Date()));
}

// ─── streaks ────────────────────────────────────────────────────────────────

export type HabitStreak = {
  thisWeekCount: number;
  target: number;
  complete: boolean; // this week's target met
  current: number; // consecutive completed weeks (grace for in-progress week)
  best: number;
};

export function streakFor(weeks: HabitWeek[], key: HabitKey): HabitStreak {
  const target = habitDef(key).target;
  const counts = new Map<string, number>();
  for (const w of weeks) if (w.habitKey === key) counts.set(w.weekStart, w.count);

  const thisMonday = mondayOf(new Date());
  const thisWeekStart = fmtDate(thisMonday);
  const thisWeekCount = counts.get(thisWeekStart) ?? 0;
  const complete = thisWeekCount >= target;

  // Walk backwards counting complete weeks. The in-progress current week does
  // not break the streak: if it isn't complete yet, start counting from last week.
  let cursor = complete ? thisMonday : addDays(thisMonday, -7);
  let current = 0;
  while ((counts.get(fmtDate(cursor)) ?? 0) >= target) {
    current++;
    cursor = addDays(cursor, -7);
  }

  // Best run across all recorded weeks (adjacency by exact +7 days).
  const completeWeeks = [...counts.entries()]
    .filter(([, c]) => c >= target)
    .map(([ws]) => ws)
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const ws of completeWeeks) {
    if (prev && fmtDate(addDays(new Date(`${prev}T00:00:00`), 7)) === ws) run++;
    else run = 1;
    best = Math.max(best, run);
    prev = ws;
  }
  best = Math.max(best, current);

  return { thisWeekCount, target, complete, current, best };
}

// ─── elapsed time ───────────────────────────────────────────────────────────

export type Elapsed = {
  monthIndex: number; // 0-based whole months since start
  monthLabel: string; // "Month 0 – 1" style bucket
  days: number;
  startedAt: Date;
};

export function elapsedSince(startedAtISO: string): Elapsed {
  const startedAt = new Date(startedAtISO);
  const now = new Date();
  let months =
    (now.getFullYear() - startedAt.getFullYear()) * 12 +
    (now.getMonth() - startedAt.getMonth());
  if (now.getDate() < startedAt.getDate()) months -= 1;
  months = Math.max(0, months);

  const days = Math.max(
    0,
    Math.floor((dateOnly(now).getTime() - dateOnly(startedAt).getTime()) / 86_400_000),
  );

  const monthLabel =
    months < 1 ? "Month 0 – 1" : months < 3 ? "Month 1 – 3" : "Month 3+";

  return { monthIndex: months, monthLabel, days, startedAt };
}

export function rhythmStreaks(data: RhythmData): Record<HabitKey, HabitStreak> {
  return {
    posts: streakFor(data.weeks, "posts"),
    outreach: streakFor(data.weeks, "outreach"),
  };
}
