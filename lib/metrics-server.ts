"use server";

import { createClient } from "@/lib/supabase/server";
import {
  EMPTY_METRICS,
  type MetricsData,
  type PipelineEntry,
  type PipelineStage,
  type PortfolioPiece,
} from "@/lib/metrics-types";

// ─── Row mappers ───────────────────────────────────────────────────────────

type PipelineRow = {
  id: string;
  business_name: string | null;
  channel: string | null;
  sector: string | null;
  stage: number | null;
  deal_value: number | string | null;
  closed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type PortfolioRow = {
  id: string;
  title: string | null;
  sector: string | null;
  url: string | null;
  shipped: boolean | null;
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
};

const clampStage = (n: number | null): PipelineStage => {
  const s = Math.min(5, Math.max(1, Math.round(n ?? 1)));
  return s as PipelineStage;
};

function toEntry(r: PipelineRow): PipelineEntry {
  return {
    id: r.id,
    businessName: r.business_name ?? "",
    channel: r.channel ?? "instagram",
    sector: r.sector ?? "",
    stage: clampStage(r.stage),
    dealValue: Number(r.deal_value ?? 0),
    closedAt: r.closed_at,
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toPiece(r: PortfolioRow): PortfolioPiece {
  return {
    id: r.id,
    title: r.title ?? "",
    sector: r.sector ?? "",
    url: r.url ?? "",
    shipped: r.shipped ?? false,
    shippedAt: r.shipped_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ─── Read ──────────────────────────────────────────────────────────────────

export async function fetchMetrics(): Promise<MetricsData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return EMPTY_METRICS;

  const [pipelineRes, portfolioRes] = await Promise.all([
    supabase
      .from("pipeline_entries")
      .select(
        "id, business_name, channel, sector, stage, deal_value, closed_at, notes, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("portfolio_pieces")
      .select("id, title, sector, url, shipped, shipped_at, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    pipeline: (pipelineRes.data ?? []).map(toEntry),
    portfolio: (portfolioRes.data ?? []).map(toPiece),
  };
}

// ─── Pipeline mutations ──────────────────────────────────────────────────────

export async function createPipelineEntry(input: {
  businessName: string;
  channel: string;
  sector?: string;
  stage?: PipelineStage;
  dealValue?: number;
  notes?: string;
}): Promise<PipelineEntry | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const stage = clampStage(input.stage ?? 1);
  const closingNow = stage === 5;

  const { data, error } = await supabase
    .from("pipeline_entries")
    .insert({
      user_id: userId,
      business_name: input.businessName.trim(),
      channel: input.channel,
      sector: input.sector?.trim() ?? "",
      stage,
      deal_value: closingNow ? Math.max(0, input.dealValue ?? 0) : 0,
      closed_at: closingNow ? new Date().toISOString() : null,
      notes: input.notes?.trim() ?? "",
    })
    .select(
      "id, business_name, channel, sector, stage, deal_value, closed_at, notes, created_at, updated_at",
    )
    .single();

  if (error || !data) return null;
  return toEntry(data);
}

export async function setPipelineStage(
  id: string,
  stage: PipelineStage,
  dealValue?: number,
): Promise<PipelineEntry | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const s = clampStage(stage);
  const closing = s === 5;

  const patch: Record<string, unknown> = { stage: s };
  if (closing) {
    patch.closed_at = new Date().toISOString();
    if (dealValue != null) patch.deal_value = Math.max(0, dealValue);
  } else {
    // Stepping back below "closed" un-recognises the deal.
    patch.closed_at = null;
    patch.deal_value = 0;
  }

  const { data, error } = await supabase
    .from("pipeline_entries")
    .update(patch)
    .eq("id", id)
    .eq("user_id", userId)
    .select(
      "id, business_name, channel, sector, stage, deal_value, closed_at, notes, created_at, updated_at",
    )
    .single();

  if (error || !data) return null;
  return toEntry(data);
}

export async function setPipelineDealValue(
  id: string,
  dealValue: number,
): Promise<PipelineEntry | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pipeline_entries")
    .update({ deal_value: Math.max(0, dealValue) })
    .eq("id", id)
    .eq("user_id", userId)
    .select(
      "id, business_name, channel, sector, stage, deal_value, closed_at, notes, created_at, updated_at",
    )
    .single();

  if (error || !data) return null;
  return toEntry(data);
}

export async function deletePipelineEntry(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = await createClient();
  await supabase
    .from("pipeline_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
}

// ─── Portfolio mutations ─────────────────────────────────────────────────────

export async function createPortfolioPiece(input: {
  title: string;
  sector?: string;
  url?: string;
  shipped?: boolean;
}): Promise<PortfolioPiece | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const shipped = input.shipped ?? false;
  const { data, error } = await supabase
    .from("portfolio_pieces")
    .insert({
      user_id: userId,
      title: input.title.trim(),
      sector: input.sector?.trim() ?? "",
      url: input.url?.trim() ?? "",
      shipped,
      shipped_at: shipped ? new Date().toISOString() : null,
    })
    .select("id, title, sector, url, shipped, shipped_at, created_at, updated_at")
    .single();

  if (error || !data) return null;
  return toPiece(data);
}

export async function setPortfolioShipped(
  id: string,
  shipped: boolean,
): Promise<PortfolioPiece | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_pieces")
    .update({
      shipped,
      shipped_at: shipped ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, title, sector, url, shipped, shipped_at, created_at, updated_at")
    .single();

  if (error || !data) return null;
  return toPiece(data);
}

export async function deletePortfolioPiece(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = await createClient();
  await supabase
    .from("portfolio_pieces")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
}
