// Pure derivations over the outcomes data. No React, no I/O — easy to reason
// about and reuse on both server and client.

import {
  PIPELINE_STAGES,
  type MetricsData,
  type PipelineEntry,
  type PortfolioPiece,
} from "@/lib/metrics-types";

export type FunnelStep = {
  stage: number;
  key: string;
  label: string;
  count: number; // entries that reached AT LEAST this stage
  // Conversion from the previous step into this one (0–1). Null for the first.
  conversion: number | null;
};

export type Funnel = {
  steps: FunnelStep[];
  // Overall: deals closed / DMs sent (0–1). Null when no DMs logged yet.
  overall: number | null;
};

// Funnel counts: an entry at stage S has passed every stage ≤ S, so each step
// counts entries whose stage is at least that step's stage.
export function buildFunnel(pipeline: PipelineEntry[]): Funnel {
  const counts = PIPELINE_STAGES.map(
    (s) => pipeline.filter((e) => e.stage >= s.stage).length,
  );

  const steps: FunnelStep[] = PIPELINE_STAGES.map((s, i) => {
    const prev = i === 0 ? null : counts[i - 1];
    const conversion =
      prev == null ? null : prev === 0 ? 0 : counts[i] / prev;
    return { stage: s.stage, key: s.key, label: s.label, count: counts[i], conversion };
  });

  const top = counts[0];
  const bottom = counts[counts.length - 1];
  const overall = top === 0 ? null : bottom / top;

  return { steps, overall };
}

function isThisMonth(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export type HeadlineMetrics = {
  clients: number; // closed deals
  portfolioShipped: number;
  revenueTotal: number; // BND, all-time recognised
  revenueMonth: number; // BND, closed this calendar month
};

export function headlineMetrics(data: MetricsData): HeadlineMetrics {
  const closed = data.pipeline.filter((e) => e.stage === 5);
  return {
    clients: closed.length,
    portfolioShipped: data.portfolio.filter((p) => p.shipped).length,
    revenueTotal: closed.reduce((sum, e) => sum + e.dealValue, 0),
    revenueMonth: closed
      .filter((e) => isThisMonth(e.closedAt))
      .reduce((sum, e) => sum + e.dealValue, 0),
  };
}

export function shippedPieces(portfolio: PortfolioPiece[]): PortfolioPiece[] {
  return portfolio.filter((p) => p.shipped);
}

// BND money formatting — no decimals for whole amounts, compact and local.
export function formatBND(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatPct(fraction: number | null): string {
  if (fraction == null) return "—";
  return `${Math.round(fraction * 100)}%`;
}
