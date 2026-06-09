-- Genzi Studio Growth OS — time + habit-streak layer (Priority 4)
-- Run once in Supabase Dashboard → SQL Editor, after 0002.
-- Safe to re-run: IF NOT EXISTS / OR REPLACE everywhere.
--
-- Adds two things that make gamification reward the habit, not just reading:
--   1. A journey start anchor, so the app can say "you're in Month 2".
--   2. A weekly habit ledger, so weekly rhythms (3 posts/week, 1 outreach hour)
--      can form a consistency streak.

-- ─── journey start anchor ─────────────────────────────────────────
-- Lives on the existing per-user singleton. Defaults to now() so existing
-- rows backfill to "started when this shipped"; users can re-anchor it.
alter table public.user_progress
  add column if not exists started_at timestamptz not null default now();

-- ─── habit_weeks ──────────────────────────────────────────────────
-- One row per (user, habit, ISO week). `count` is how many times the habit
-- was logged that week; the weekly target lives in app config, not here.
-- week_start is always the Monday of the week (date, no time).

create table if not exists public.habit_weeks (
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_key   text not null,                 -- 'posts' | 'outreach'
  week_start  date not null,                 -- Monday of the ISO week
  count       integer not null default 0 check (count >= 0),
  updated_at  timestamptz not null default now(),
  primary key (user_id, habit_key, week_start)
);

create index if not exists habit_weeks_user_idx
  on public.habit_weeks (user_id);

drop trigger if exists trg_touch_habit_weeks on public.habit_weeks;
create trigger trg_touch_habit_weeks
  before update on public.habit_weeks
  for each row execute function public.touch_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────
alter table public.habit_weeks enable row level security;

drop policy if exists "users read own habits"   on public.habit_weeks;
drop policy if exists "users insert own habits"  on public.habit_weeks;
drop policy if exists "users update own habits"  on public.habit_weeks;
drop policy if exists "users delete own habits"  on public.habit_weeks;

create policy "users read own habits"
  on public.habit_weeks for select using (auth.uid() = user_id);
create policy "users insert own habits"
  on public.habit_weeks for insert with check (auth.uid() = user_id);
create policy "users update own habits"
  on public.habit_weeks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own habits"
  on public.habit_weeks for delete using (auth.uid() = user_id);
