"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress-store";
import { PANELS, TOTAL_TASKS, type PanelId } from "@/content/panels";
import { sound } from "@/lib/audio";

export function OverallProgress() {
  const progress = useProgress();
  const totalSections = PANELS.length - 1; // exclude overview itself
  const sectionsRead = progress.sectionsRead.filter((s) => s !== "overview").length;
  const tasksDone = progress.checkedTasks.length;
  const pct = Math.round(
    ((sectionsRead / Math.max(1, totalSections)) +
      (tasksDone / Math.max(1, TOTAL_TASKS))) /
      2 * 100,
  );

  return (
    <section className="mb-6 rounded-xl border border-border-base bg-bg-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-dim">
          Overall Progress
        </span>
        <span className="font-mono text-sm font-semibold text-brass">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-1000 ease-spring"
          style={{ width: `${pct}%` }}
        />
      </div>
    </section>
  );
}

export function NavCards({ subtitles }: { subtitles: Record<PanelId, string> }) {
  const progress = useProgress();
  const checkedByPanel = (panelId: PanelId) =>
    progress.checkedTasks.filter((t) => t.startsWith(`${panelId}:`)).length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {PANELS.filter((p) => p.id !== "overview").map((p) => {
        const read = progress.sectionsRead.includes(p.id) ? 1 : 0;
        const taskFrac = p.taskCount > 0 ? checkedByPanel(p.id) / p.taskCount : 0;
        const pct = Math.round(((read + taskFrac) / 2) * 100);
        return (
          <Link
            key={p.id}
            href={p.href}
            onClick={() => sound.nav()}
            className="group flex flex-col gap-2.5 rounded-xl border border-border-base bg-bg-2 p-5 transition-[transform,border-color,background-color] duration-200 ease-spring hover:-translate-y-[2px] hover:border-brass-dim hover:bg-brass/[0.03]"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-brass-dim">
              {p.eyebrow}
            </div>
            <div className="text-base font-medium text-cream">
              {p.title}
              {p.titleEm && <span className="ml-1">{p.titleEm}</span>}
            </div>
            <div className="text-[13px] leading-[1.6] text-cream-mid">
              {subtitles[p.id]}
            </div>
            <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-bg-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-600 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-cream-dim">{pct}% complete</div>
          </Link>
        );
      })}
    </div>
  );
}
