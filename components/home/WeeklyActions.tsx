"use client";

import Link from "next/link";
import { useProgress, useProgressActions } from "@/lib/progress-store";
import { useEffects } from "@/components/shell/Effects";
import { sound } from "@/lib/audio";
import { WEEKLY_ACTIONS, taskId } from "@/content/tasks";
import { PANEL_BY_ID } from "@/content/panels";

export function WeeklyActions() {
  const progress = useProgress();
  const { toggleTask } = useProgressActions();
  const effects = useEffects();

  const done = WEEKLY_ACTIONS.filter((a) =>
    progress.checkedTasks.includes(taskId(a.panelId, a.index)),
  ).length;

  return (
    <section className="overflow-hidden rounded-xl border border-border-base bg-bg-2">
      <div className="flex items-center justify-between border-b border-border-base px-5 py-4">
        <div>
          <h3 className="font-display text-[17px] font-light text-cream">This week&apos;s actions</h3>
          <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
            The highest-leverage move from each part of the playbook
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border-soft px-2.5 py-1 font-mono text-[11px] tabular-nums text-brass">
          {done}/{WEEKLY_ACTIONS.length}
        </span>
      </div>

      <ul>
        {WEEKLY_ACTIONS.map(({ panelId, index, task }) => {
          const id = taskId(panelId, index);
          const checked = progress.checkedTasks.includes(id);
          const panel = PANEL_BY_ID[panelId];

          const handle = (x: number, y: number) => {
            const nowChecked = toggleTask(id, task.xp);
            if (nowChecked) {
              sound.check();
              effects.burst(x, y);
              if (task.xp > 0) effects.xpFloat(x, y - 18, task.xp);
            } else {
              sound.uncheck();
              if (task.xp > 0) effects.xpFloat(x, y - 18, -task.xp);
            }
          };

          return (
            <li
              key={id}
              className={[
                "flex items-center gap-3.5 border-b border-border-base px-5 py-3.5 last:border-b-0 transition-colors duration-150",
                checked ? "bg-green/[0.04]" : "",
              ].join(" ")}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-label={task.text}
                onClick={(ev) => handle(ev.clientX, ev.clientY)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    const r = ev.currentTarget.getBoundingClientRect();
                    handle(r.left + 12, r.top + r.height / 2);
                  }
                }}
                className="grid h-5 w-5 shrink-0 place-items-center rounded text-[11px] transition-all duration-250 ease-spring focus-visible:outline-2 focus-visible:outline-brass/60"
                style={
                  checked
                    ? { background: "var(--green)", borderColor: "var(--green)", color: "#fff", transform: "scale(1.05)" }
                    : { border: "1px solid var(--border-light)", color: "transparent" }
                }
              >
                ✓
              </button>

              <span
                className={[
                  "flex-1 text-[14px] leading-[1.4]",
                  checked ? "text-cream-dim line-through decoration-cream-dim/40" : "text-cream-mid",
                ].join(" ")}
              >
                {task.text}
              </span>

              <Link
                href={panel.href}
                onClick={() => sound.nav()}
                className="shrink-0 rounded-full border border-border-base px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-cream-dim transition-colors duration-150 hover:border-brass-dim hover:text-brass"
              >
                {panel.label} →
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
