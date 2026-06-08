// Panel registry — drives sidebar nav, routing, and progress tracking.
// Adding a new panel = add an entry here + create app/dashboard/<id>/page.tsx.

export const PANEL_IDS = [
  "overview",
  "roadmap",
  "portfolio",
  "pricing",
  "specwork",
  "personalbrand",
  "outreach",
] as const;

export type PanelId = (typeof PANEL_IDS)[number];

export type PanelMeta = {
  id: PanelId;
  href: string;
  icon: string;
  label: string;
  eyebrow: string;
  title: string;
  titleEm?: string;
  description: string;
  taskCount: number;
};

// The original HTML had these XP values per checklist task.
// Used to compute total task XP and per-section progress percentages.
export const PANELS: PanelMeta[] = [
  {
    id: "overview",
    href: "/dashboard",
    icon: "◈",
    label: "Overview",
    eyebrow: "Mission Control",
    title: "Your",
    titleEm: "Growth OS",
    description:
      "Everything you need to grow Genzi Studio from zero clients to a thriving Brunei agency — all in one place. Read each section to earn XP, complete tasks to level up.",
    taskCount: 0,
  },
  {
    id: "roadmap",
    href: "/dashboard/roadmap",
    icon: "◎",
    label: "Roadmap",
    eyebrow: "Phase overview",
    title: "3-Phase",
    titleEm: "Roadmap",
    description:
      "Your complete growth timeline — from today with zero clients to a predictable, recurring-revenue agency. Each phase unlocks the next.",
    taskCount: 5,
  },
  {
    id: "portfolio",
    href: "/dashboard/portfolio",
    icon: "◱",
    label: "Portfolio",
    eyebrow: "Foundation",
    title: "Build your",
    titleEm: "Portfolio",
    description:
      "The strategy to go from zero proof to 3–5 compelling portfolio pieces — without waiting for a paying client to hire you first.",
    taskCount: 8,
  },
  {
    id: "pricing",
    href: "/dashboard/pricing",
    icon: "◐",
    label: "Pricing",
    eyebrow: "Deals",
    title: "Pricing",
    titleEm: "Strategy",
    description:
      "How to approach free and discounted work so it builds your reputation rather than devaluing it. The framing you use makes all the difference.",
    taskCount: 5,
  },
  {
    id: "specwork",
    href: "/dashboard/specwork",
    icon: "◆",
    label: "Spec Work",
    eyebrow: "Execution",
    title: "Spec Work",
    titleEm: "Process",
    description:
      "The complete 5-stage system for creating portfolio pieces without a client — and how to turn each finished piece into a real door opener.",
    taskCount: 5,
  },
  {
    id: "personalbrand",
    href: "/dashboard/personalbrand",
    icon: "◉",
    label: "Personal Brand",
    eyebrow: "Visibility",
    title: "Personal Brand",
    titleEm: "System",
    description:
      "How to use ibrahimsatria._ strategically to attract clients for Genzi Studio. The agency builds proof — your personal brand builds the person behind the proof.",
    taskCount: 6,
  },
  {
    id: "outreach",
    href: "/dashboard/outreach",
    icon: "◀",
    label: "Outreach",
    eyebrow: "Client Acquisition",
    title: "Outreach",
    titleEm: "Playbook",
    description:
      "Discovery-first outreach for Brunei SMEs. The scripts, channels, and sequences that start real conversations — not pitches that get ignored.",
    taskCount: 7,
  },
];

export const PANEL_BY_ID: Record<PanelId, PanelMeta> = Object.fromEntries(
  PANELS.map((p) => [p.id, p]),
) as Record<PanelId, PanelMeta>;

export const TOTAL_TASKS = PANELS.reduce((n, p) => n + p.taskCount, 0);
export const TOTAL_SECTIONS = PANELS.length;
