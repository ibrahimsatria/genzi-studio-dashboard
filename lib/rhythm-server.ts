"use server";

import { createClient } from "@/lib/supabase/server";
import {
  EMPTY_RHYTHM,
  type HabitKey,
  type HabitWeek,
  type RhythmData,
} from "@/lib/rhythm-types";
import { currentWeekStart } from "@/lib/rhythm-derive";

type HabitRow = {
  habit_key: string;
  week_start: string;
  count: number | null;
};

function toHabitWeek(r: HabitRow): HabitWeek {
  return {
    habitKey: r.habit_key as HabitKey,
    weekStart: r.week_start,
    count: r.count ?? 0,
  };
}

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchRhythm(): Promise<RhythmData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return EMPTY_RHYTHM;

  const [progressRes, weeksRes] = await Promise.all([
    supabase
      .from("user_progress")
      .select("started_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("habit_weeks")
      .select("habit_key, week_start, count")
      .eq("user_id", user.id)
      .order("week_start", { ascending: false }),
  ]);

  return {
    startedAt: progressRes.data?.started_at ?? EMPTY_RHYTHM.startedAt,
    weeks: (weeksRes.data ?? []).map(toHabitWeek),
  };
}

// Increment (or decrement) this week's count for a habit. Clamped at 0.
export async function adjustHabit(
  key: HabitKey,
  delta: number,
): Promise<HabitWeek | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();
  const weekStart = currentWeekStart();

  const { data: existing } = await supabase
    .from("habit_weeks")
    .select("count")
    .eq("user_id", userId)
    .eq("habit_key", key)
    .eq("week_start", weekStart)
    .maybeSingle();

  const next = Math.max(0, (existing?.count ?? 0) + delta);

  const { data, error } = await supabase
    .from("habit_weeks")
    .upsert(
      { user_id: userId, habit_key: key, week_start: weekStart, count: next },
      { onConflict: "user_id,habit_key,week_start" },
    )
    .select("habit_key, week_start, count")
    .single();

  if (error || !data) return null;
  return toHabitWeek(data);
}

export async function setStartedAt(iso: string): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_progress")
    .update({ started_at: iso })
    .eq("user_id", userId)
    .select("started_at")
    .single();

  if (error || !data) return null;
  return data.started_at;
}
