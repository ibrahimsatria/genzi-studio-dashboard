// Centralized checklist tasks for every panel.
//
// Task identity is "<panel>:<index>" — the SAME id the progress store has always
// used — so the index of each task within its panel array MUST stay stable.
// Both the section pages and the home "this week" view read from here, which is
// what lets a task completed in one place light up everywhere.

import type { PanelId } from "@/content/panels";

export type Task = {
  text: string;
  xp: number;
  label?: string;
  // Surfaced in the home "This week's actions" view as a high-leverage,
  // do-it-now action pulled out of its section.
  weekly?: boolean;
};

export const PANEL_TASKS: Record<PanelId, Task[]> = {
  overview: [],

  roadmap: [
    { text: "Choose 3 local businesses for spec work this week", xp: 10, weekly: true },
    { text: "Write a real brief before opening any design tool", xp: 10 },
    { text: "Identify 2 businesses for discounted partnership", xp: 10 },
    { text: "Update your personal Instagram bio to reference @genzistudio", xp: 10 },
    { text: "Post your first process or founder journey content this week", xp: 10, weekly: true },
  ],

  portfolio: [
    { text: "Written brief (audience, problem, strategic direction, constraints)", xp: 10, label: "essential", weekly: true },
    { text: "Logo + minimum 3 variations (horizontal, stacked, icon only)", xp: 10, label: "essential" },
    { text: "Full colour palette with named roles and usage rules", xp: 10, label: "essential" },
    { text: "Typography pairing with at least 3 usage examples in context", xp: 10, label: "essential" },
    { text: "3+ application mockups (business card, signage or packaging, social)", xp: 10, label: "essential" },
    { text: "Instagram template set — at least one feed post and one story", xp: 10, label: "strong add" },
    { text: "Before screenshot + side-by-side comparison for the case study", xp: 10, label: "strong add" },
    { text: "One-page written case study following problem → strategy → result", xp: 10, label: "strong add" },
  ],

  pricing: [
    { text: "Publishing rights confirmed in writing before any work begins", xp: 15, weekly: true },
    { text: "Rate and full scope defined clearly and agreed before starting", xp: 15 },
    { text: "Hard expiry on the rate communicated upfront in the conversation", xp: 15 },
    { text: "Revision rounds capped at 2 and stated at project kickoff", xp: 15 },
    { text: "Testimonial request planned and ready to send on delivery day", xp: 15 },
  ],

  specwork: [
    { text: "Identify your first spec target and confirm it meets the 3 criteria", xp: 20, weekly: true },
    { text: "Write the full brief (audience, problem, direction, constraints)", xp: 20 },
    { text: "Complete the full scope — logo system, palette, type, 3+ mockups", xp: 20 },
    { text: "Write the one-page case study following problem → strategy → result", xp: 20 },
    { text: "DM the real business and share the work with no strings attached", xp: 20 },
  ],

  personalbrand: [
    { text: "Update ibrahimsatria._ bio with positioning + link to @genzistudio", xp: 15 },
    { text: "Update @genzistudio bio with positioning + link to personal account", xp: 15 },
    { text: "Write your first process post showing real work in progress", xp: 15, weekly: true },
    { text: "Write your first perspective post — a sharp take on local SME branding", xp: 15 },
    { text: "Write your first founder journey post — honest, not polished", xp: 15 },
    { text: "Commit to a 3-post-per-week schedule for the next 4 weeks", xp: 15 },
  ],

  outreach: [
    { text: "Build a target list of 20 specific BSB businesses to approach", xp: 20, weekly: true },
    { text: "Write one specific observation for each of your top 5 targets", xp: 20 },
    { text: "Send your first spec-delivery DM to a business you've designed for", xp: 20 },
    { text: "Ask for one warm introduction from someone in your network", xp: 20 },
    { text: "Send 5 specific-observation cold DMs across Tue–Thu this week", xp: 20, weekly: true },
    { text: "Set up a simple outreach log (target, channel, date, response)", xp: 20 },
    { text: "Block a recurring weekly hour on your calendar for outreach", xp: 20 },
  ],
};

export type WeeklyAction = { panelId: PanelId; index: number; task: Task };

// The curated "this week" set — every task flagged weekly, with the panel + index
// needed to build its stable "<panel>:<index>" id.
export const WEEKLY_ACTIONS: WeeklyAction[] = (
  Object.entries(PANEL_TASKS) as [PanelId, Task[]][]
).flatMap(([panelId, tasks]) =>
  tasks
    .map((task, index) => ({ panelId, index, task }))
    .filter((t) => t.task.weekly),
);

export function taskId(panelId: PanelId, index: number): string {
  return `${panelId}:${index}`;
}

// Reverse lookup: given a "<panel>:<index>" id, return the task (for the
// "recently completed" momentum cue on the home view).
export function taskById(id: string): { panelId: PanelId; index: number; task: Task } | null {
  const [panelId, idxRaw] = id.split(":");
  const index = Number(idxRaw);
  const tasks = PANEL_TASKS[panelId as PanelId];
  if (!tasks || Number.isNaN(index) || !tasks[index]) return null;
  return { panelId: panelId as PanelId, index, task: tasks[index] };
}
