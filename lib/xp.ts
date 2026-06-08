export type LevelDef = { n: number; name: string; need: number };

export const LEVELS: LevelDef[] = [
  { n: 1, name: "Founder", need: 0 },
  { n: 2, name: "Strategist", need: 200 },
  { n: 3, name: "Builder", need: 450 },
  { n: 4, name: "Authority", need: 750 },
  { n: 5, name: "Agency Owner", need: 1100 },
];

export const SECTION_XP = 50;

export function levelFromXP(xp: number): LevelDef {
  let result = LEVELS[0];
  for (const lvl of LEVELS) if (xp >= lvl.need) result = lvl;
  return result;
}

export function progressToNext(xp: number): {
  current: LevelDef;
  next: LevelDef | null;
  pct: number;
} {
  const current = levelFromXP(xp);
  const next = LEVELS.find((l) => l.n === current.n + 1) ?? null;
  if (!next) return { current, next: null, pct: 100 };
  const span = next.need - current.need;
  const into = xp - current.need;
  const pct = Math.min(100, Math.max(0, (into / span) * 100));
  return { current, next, pct };
}
