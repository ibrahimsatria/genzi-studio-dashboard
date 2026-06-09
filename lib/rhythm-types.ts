// Time + weekly-habit layer (Priority 4). Backed by 0003_rhythm.sql.

export type HabitKey = "posts" | "outreach";

export type HabitDef = {
  key: HabitKey;
  label: string;
  target: number; // completions per week to "complete" the week
  unit: string; // singular noun for one completion
  verb: string; // button label to log one
  hint: string;
};

export const HABITS: HabitDef[] = [
  {
    key: "posts",
    label: "Content posts",
    target: 3,
    unit: "post",
    verb: "Log a post",
    hint: "3 posts/week across your two accounts — process, perspective, founder note.",
  },
  {
    key: "outreach",
    label: "Outreach hour",
    target: 1,
    unit: "session",
    verb: "Log outreach",
    hint: "One protected hour each week sending specific, considered DMs.",
  },
];

export function habitDef(key: HabitKey): HabitDef {
  return HABITS.find((h) => h.key === key) ?? HABITS[0];
}

export type HabitWeek = {
  habitKey: HabitKey;
  weekStart: string; // yyyy-mm-dd (Monday)
  count: number;
};

export type RhythmData = {
  startedAt: string; // ISO timestamp — journey anchor
  weeks: HabitWeek[];
};

export const EMPTY_RHYTHM: RhythmData = {
  startedAt: new Date().toISOString(),
  weeks: [],
};
