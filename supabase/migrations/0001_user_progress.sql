-- Genzi Studio Growth OS — initial schema
-- Run this once in your Supabase Dashboard → SQL Editor.
-- It is safe to re-run: it uses IF NOT EXISTS / OR REPLACE everywhere.

-- ─── user_progress ────────────────────────────────────────────────
-- One row per authenticated user. Holds all gamification state.

create table if not exists public.user_progress (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  xp               integer not null default 0 check (xp >= 0),
  level            integer not null default 1 check (level between 1 and 5),
  sections_read    text[]  not null default '{}'::text[],
  checked_tasks    text[]  not null default '{}'::text[],   -- format: "<panel>:<index>"
  active_panel     text    not null default 'overview',
  sound_enabled    boolean not null default true,
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at on every write
create or replace function public.touch_user_progress()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_user_progress on public.user_progress;
create trigger trg_touch_user_progress
  before update on public.user_progress
  for each row execute function public.touch_user_progress();

-- ─── Row Level Security ───────────────────────────────────────────
alter table public.user_progress enable row level security;

drop policy if exists "users read own progress"   on public.user_progress;
drop policy if exists "users insert own progress" on public.user_progress;
drop policy if exists "users update own progress" on public.user_progress;
drop policy if exists "users delete own progress" on public.user_progress;

create policy "users read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "users insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "users update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- ─── Auto-create progress row on signup ───────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_progress (user_id) values (new.id)
    on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
