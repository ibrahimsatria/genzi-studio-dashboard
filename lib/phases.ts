// "Each phase unlocks the next" — derived from real outcomes (Priority 4).
// Phases gate on proof, not time: you unlock Activate Channels once you have
// portfolio proof, and Scale once you've converted a client. Time is tracked
// separately (see rhythm-derive elapsedSince) and shown alongside.

import { headlineMetrics } from "@/lib/metrics-derive";
import { PORTFOLIO_GOAL_MIN, type MetricsData } from "@/lib/metrics-types";

export type PhaseInfo = {
  n: 1 | 2 | 3;
  name: string;
  span: string; // "Now" | "Next" | "Scale"
  time: string; // "Month 0 – 1"
  unlocked: boolean;
  // Null for phase 1 (always unlocked). Otherwise the gate + progress toward it.
  criterion: string | null;
  have: number;
  need: number;
};

export function phaseStatus(metrics: MetricsData): PhaseInfo[] {
  const m = headlineMetrics(metrics);

  const proofUnlocked = m.portfolioShipped >= PORTFOLIO_GOAL_MIN;
  const clientUnlocked = m.clients >= 1;

  return [
    {
      n: 1,
      name: "Build Proof",
      span: "Now",
      time: "Month 0 – 1",
      unlocked: true,
      criterion: null,
      have: m.portfolioShipped,
      need: PORTFOLIO_GOAL_MIN,
    },
    {
      n: 2,
      name: "Activate Channels",
      span: "Next",
      time: "Month 1 – 3",
      unlocked: proofUnlocked,
      criterion: `Ship ${PORTFOLIO_GOAL_MIN} portfolio pieces`,
      have: m.portfolioShipped,
      need: PORTFOLIO_GOAL_MIN,
    },
    {
      n: 3,
      name: "Convert & Retain",
      span: "Scale",
      time: "Month 3+",
      unlocked: clientUnlocked,
      criterion: "Win your first client",
      have: m.clients,
      need: 1,
    },
  ];
}

// The nearest locked phase + how far off it is — powers the "what unlocks next"
// momentum cue. Returns null when everything is unlocked.
export function nextUnlock(metrics: MetricsData): PhaseInfo | null {
  return phaseStatus(metrics).find((p) => !p.unlocked) ?? null;
}
