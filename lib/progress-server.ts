"use server";

import { createClient } from "@/lib/supabase/server";
import { EMPTY_PROGRESS, type Progress } from "@/lib/progress-types";
import { PANEL_IDS, type PanelId } from "@/content/panels";
import { levelFromXP } from "@/lib/xp";

const VALID_PANELS = new Set<string>(PANEL_IDS);

type Row = {
  xp: number;
  level: number;
  sections_read: string[] | null;
  checked_tasks: string[] | null;
  active_panel: string | null;
  sound_enabled: boolean | null;
};

function rowToProgress(row: Row | null): Progress {
  if (!row) return EMPTY_PROGRESS;
  const sectionsRead = (row.sections_read ?? []).filter((s): s is PanelId =>
    VALID_PANELS.has(s),
  );
  const active = row.active_panel && VALID_PANELS.has(row.active_panel)
    ? (row.active_panel as PanelId)
    : "overview";
  return {
    xp: row.xp ?? 0,
    level: row.level ?? 1,
    sectionsRead,
    checkedTasks: row.checked_tasks ?? [],
    activePanel: active,
    soundEnabled: row.sound_enabled ?? true,
  };
}

async function load(): Promise<{ userId: string | null; progress: Progress }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, progress: EMPTY_PROGRESS };

  const { data } = await supabase
    .from("user_progress")
    .select("xp, level, sections_read, checked_tasks, active_panel, sound_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  return { userId: user.id, progress: rowToProgress(data) };
}

export async function fetchProgress(): Promise<Progress> {
  const { progress } = await load();
  return progress;
}

async function save(userId: string, p: Progress) {
  const supabase = await createClient();
  await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        xp: p.xp,
        level: p.level,
        sections_read: p.sectionsRead,
        checked_tasks: p.checkedTasks,
        active_panel: p.activePanel,
        sound_enabled: p.soundEnabled,
      },
      { onConflict: "user_id" },
    );
}

// ─── Actions ─────────────────────────────────────────────────────────────

export async function awardSectionRead(panelId: PanelId, sectionXp: number) {
  const { userId, progress } = await load();
  if (!userId) return;
  if (progress.sectionsRead.includes(panelId)) return;
  const xp = Math.max(0, progress.xp + sectionXp);
  await save(userId, {
    ...progress,
    xp,
    level: levelFromXP(xp).n,
    sectionsRead: [...progress.sectionsRead, panelId],
  });
}

export async function toggleTask(taskId: string, xpDelta: number) {
  const { userId, progress } = await load();
  if (!userId) return;
  const isChecked = progress.checkedTasks.includes(taskId);
  const checkedTasks = isChecked
    ? progress.checkedTasks.filter((t) => t !== taskId)
    : [...progress.checkedTasks, taskId];
  const delta = isChecked ? -xpDelta : xpDelta;
  const xp = Math.max(0, progress.xp + delta);
  await save(userId, {
    ...progress,
    xp,
    level: levelFromXP(xp).n,
    checkedTasks,
  });
}

export async function setActivePanel(panelId: PanelId) {
  const { userId, progress } = await load();
  if (!userId) return;
  if (progress.activePanel === panelId) return;
  await save(userId, { ...progress, activePanel: panelId });
}

export async function setSoundEnabled(on: boolean) {
  const { userId, progress } = await load();
  if (!userId) return;
  if (progress.soundEnabled === on) return;
  await save(userId, { ...progress, soundEnabled: on });
}

export async function resetProgress() {
  const { userId } = await load();
  if (!userId) return;
  await save(userId, EMPTY_PROGRESS);
}
