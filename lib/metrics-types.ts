// Outcomes layer — the data that makes this an actual dashboard.
// See supabase/migrations/0002_metrics.sql for the backing schema.

export type PipelineStage = 1 | 2 | 3 | 4 | 5;

export type StageDef = {
  stage: PipelineStage;
  key: "dm_sent" | "replied" | "call_booked" | "proposal_sent" | "deal_closed";
  label: string; // funnel label (plural)
  action: string; // button/verb when advancing TO this stage
};

// Ordered, low → high. Index 0 is the entry point of the funnel.
export const PIPELINE_STAGES: StageDef[] = [
  { stage: 1, key: "dm_sent", label: "DMs sent", action: "Log DM" },
  { stage: 2, key: "replied", label: "Replies", action: "Got reply" },
  { stage: 3, key: "call_booked", label: "Calls booked", action: "Booked call" },
  { stage: 4, key: "proposal_sent", label: "Proposals sent", action: "Sent proposal" },
  { stage: 5, key: "deal_closed", label: "Deals closed", action: "Closed deal" },
];

export type ChannelDef = { key: string; label: string };

export const CHANNELS: ChannelDef[] = [
  { key: "instagram", label: "Instagram DM" },
  { key: "warm_intro", label: "Warm intro" },
  { key: "cold_dm", label: "Specific-observation DM" },
  { key: "linkedin", label: "LinkedIn / events" },
];

export function channelLabel(key: string): string {
  return CHANNELS.find((c) => c.key === key)?.label ?? key;
}

// Portfolio goal — the 3–5 piece target from the brief. Fixed in app config.
export const PORTFOLIO_GOAL_MIN = 3;
export const PORTFOLIO_GOAL_MAX = 5;

export type PipelineEntry = {
  id: string;
  businessName: string;
  channel: string;
  sector: string;
  stage: PipelineStage;
  dealValue: number; // BND
  closedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioPiece = {
  id: string;
  title: string;
  sector: string;
  url: string;
  shipped: boolean;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MetricsData = {
  pipeline: PipelineEntry[];
  portfolio: PortfolioPiece[];
};

export const EMPTY_METRICS: MetricsData = { pipeline: [], portfolio: [] };
