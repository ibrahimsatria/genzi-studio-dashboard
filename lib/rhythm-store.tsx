"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  type HabitKey,
  type HabitWeek,
  type RhythmData,
} from "@/lib/rhythm-types";
import { currentWeekStart } from "@/lib/rhythm-derive";
import {
  adjustHabit as adjustHabitAction,
  setStartedAt as setStartedAtAction,
} from "@/lib/rhythm-server";

type Actions = {
  logHabit: (key: HabitKey) => void;
  unlogHabit: (key: HabitKey) => void;
  setStartedAt: (iso: string) => void;
};

const DataCtx = createContext<RhythmData | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

function applyDelta(weeks: HabitWeek[], key: HabitKey, delta: number): HabitWeek[] {
  const weekStart = currentWeekStart();
  const idx = weeks.findIndex((w) => w.habitKey === key && w.weekStart === weekStart);
  if (idx === -1) {
    if (delta <= 0) return weeks;
    return [{ habitKey: key, weekStart, count: delta }, ...weeks];
  }
  const next = Math.max(0, weeks[idx].count + delta);
  const copy = weeks.slice();
  copy[idx] = { ...copy[idx], count: next };
  return copy;
}

export function RhythmProvider({
  initial,
  children,
}: {
  initial: RhythmData;
  children: React.ReactNode;
}) {
  const [startedAt, setStartedAtState] = useState(initial.startedAt);
  const [weeks, setWeeks] = useState<HabitWeek[]>(initial.weeks);

  const actions = useMemo<Actions>(() => {
    const adjust = (key: HabitKey, delta: number) => {
      setWeeks((prev) => applyDelta(prev, key, delta));
      adjustHabitAction(key, delta)
        .then((saved) => {
          if (!saved) return;
          setWeeks((prev) => {
            const i = prev.findIndex(
              (w) => w.habitKey === saved.habitKey && w.weekStart === saved.weekStart,
            );
            if (i === -1) return [saved, ...prev];
            const copy = prev.slice();
            copy[i] = saved;
            return copy;
          });
        })
        .catch(() => {});
    };

    return {
      logHabit: (key) => adjust(key, +1),
      unlogHabit: (key) => adjust(key, -1),
      setStartedAt: (iso) => {
        setStartedAtState(iso);
        setStartedAtAction(iso).catch(() => {});
      },
    };
  }, []);

  const data = useMemo<RhythmData>(() => ({ startedAt, weeks }), [startedAt, weeks]);

  return (
    <ActionsCtx.Provider value={actions}>
      <DataCtx.Provider value={data}>{children}</DataCtx.Provider>
    </ActionsCtx.Provider>
  );
}

export function useRhythm(): RhythmData {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useRhythm must be used inside RhythmProvider");
  return ctx;
}

export function useRhythmActions(): Actions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error("useRhythmActions must be used inside RhythmProvider");
  return ctx;
}
