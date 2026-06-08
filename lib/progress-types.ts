import type { PanelId } from "@/content/panels";

export type Progress = {
  xp: number;
  level: number;
  sectionsRead: PanelId[];
  checkedTasks: string[]; // "<panel>:<index>" e.g. "roadmap:2"
  activePanel: PanelId;
  soundEnabled: boolean;
};

export const EMPTY_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  sectionsRead: [],
  checkedTasks: [],
  activePanel: "overview",
  soundEnabled: true,
};
