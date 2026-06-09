-- Genzi Studio Growth OS — outcomes layer (metrics, pipeline, portfolio)
-- Run this once in your Supabase Dashboard → SQL Editor, after 0001.
-- It is safe to re-run: it uses IF NOT EXISTS / OR REPLACE everywhere.
--
-- This migration adds the data that turns the app from an activity tracker
-- into an actual dashboard: a unified outreach pipeline (which doubles as the
-- funnel, the client count, and the revenue ledger) plus a portfolio ledger.

-- ─── generic updated_at trigger fn ────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── pipeline_entries ─────────────────────────────────────────────
-- One row per prospect/business in your outreach pipeline. The single
-- source of truth for the funnel, the client count, and revenue:
--   stage 1 dm_sent → 2 replied → 3 call_booked → 4 proposal_sent → 5 deal_closed
-- A prospect at a given stage has implicitly passed every earlier stage,
-- so funnel counts are simply "how many entries reached at least stage N".
-- A closed deal (stage 5) is a client; its deal_value is recognised revenue.

create table if not exists public.pipeline_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  business_name text    not null default '',
  channel       text    not null default 'instagram',   -- instagram | warm_intro | cold_dm | linkedin
  sector        text    not null default '',
  stage         smallint not null default 1 check (stage between 1 and 5),
  deal_value    numeric(12,2) not null default 0 check (deal_value >= 0),  -- BND, set on close
  closed_at     timestamptz,                              -- set when stage reaches 5
  notes         text    not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists pipeline_entries_user_idx
  on public.pipeline_entries (user_id);

drop trigger if exists trg_touch_pipeline_entries on public.pipeline_entries;
create trigger trg_touch_pipeline_entries
  before update on public.pipeline_entries
  for each row execute function public.touch_updated_at();

-- ─── portfolio_pieces ─────────────────────────────────────────────
-- One row per portfolio piece. `shipped` drives the "pieces shipped"
-- counter that progresses toward the 3–5 goal (goal lives in app config).

create table if not exists public.portfolio_pieces (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text    not null default '',
  sector      text    not null default '',
  url         text    not null default '',
  shipped     boolean not null default false,
  shipped_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists portfolio_pieces_user_idx
  on public.portfolio_pieces (user_id);

drop trigger if exists trg_touch_portfolio_pieces on public.portfolio_pieces;
create trigger trg_touch_portfolio_pieces
  before update on public.portfolio_pieces
  for each row execute function public.touch_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────
alter table public.pipeline_entries enable row level security;
alter table public.portfolio_pieces enable row level security;

drop policy if exists "users read own pipeline"   on public.pipeline_entries;
drop policy if exists "users insert own pipeline"  on public.pipeline_entries;
drop policy if exists "users update own pipeline"  on public.pipeline_entries;
drop policy if exists "users delete own pipeline"  on public.pipeline_entries;

create policy "users read own pipeline"
  on public.pipeline_entries for select using (auth.uid() = user_id);
create policy "users insert own pipeline"
  on public.pipeline_entries for insert with check (auth.uid() = user_id);
create policy "users update own pipeline"
  on public.pipeline_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own pipeline"
  on public.pipeline_entries for delete using (auth.uid() = user_id);

drop policy if exists "users read own portfolio"   on public.portfolio_pieces;
drop policy if exists "users insert own portfolio" on public.portfolio_pieces;
drop policy if exists "users update own portfolio" on public.portfolio_pieces;
drop policy if exists "users delete own portfolio" on public.portfolio_pieces;

create policy "users read own portfolio"
  on public.portfolio_pieces for select using (auth.uid() = user_id);
create policy "users insert own portfolio"
  on public.portfolio_pieces for insert with check (auth.uid() = user_id);
create policy "users update own portfolio"
  on public.portfolio_pieces for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own portfolio"
  on public.portfolio_pieces for delete using (auth.uid() = user_id);
