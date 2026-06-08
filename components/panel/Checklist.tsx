"use client";

import { useProgress, useProgressActions } from "@/lib/progress-store";
import { useEffects } from "@/components/shell/Effects";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import type { PanelId } from "@/content/panels";

export type ChecklistTask = {
  text: string;
  xp: number;
  // Optional suffix shown after the XP amount. e.g. "essential", "strong add"
  label?: string;
};

export function Checklist({
  panelId,
  tasks,
}: {
  panelId: PanelId;
  tasks: ChecklistTask[];
}) {
  const progress = useProgress();
  const { toggleTask } = useProgressActions();
  const effects = useEffects();
  const toast = useToast();

  return (
    <ul className="overflow-hidden rounded-xl border border-border-base bg-bg-2">
      {tasks.map((task, i) => {
        const id = `${panelId}:${i}`;
        const checked = progress.checkedTasks.includes(id);
        return (
          <li
            key={id}
            tabIndex={0}
            role="checkbox"
            aria-checked={checked}
            onClick={(e) => handle(e.currentTarget, e.clientX, e.clientY)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                handle(e.currentTarget, rect.left + 24, rect.top + rect.height / 2);
              }
            }}
            className={[
              "flex cursor-pointer items-center gap-3.5 border-b border-border-base px-5 py-4 transition-colors duration-150 last:border-b-0",
              checked
                ? "bg-green/[0.04]"
                : "hover:bg-bg-3 focus-visible:bg-bg-3",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={[
                "grid h-5 w-5 shrink-0 place-items-center rounded text-[11px] transition-all duration-250 ease-spring",
                checked
                  ? "scale-105 border-green bg-green text-white"
                  : "border border-border-soft text-transparent",
              ].join(" ")}
            >
              ✓
            </span>
            <span
              className={[
                "flex-1 text-[14px] leading-[1.4] transition-colors duration-200",
                checked
                  ? "text-cream-dim line-through decoration-cream-dim/40"
                  : "text-cream-mid",
              ].join(" ")}
            >
              {task.text}
            </span>
            <span
              className={[
                "shrink-0 font-mono text-[10px] transition-colors duration-200",
                checked ? "text-green" : "text-brass-dim",
              ].join(" ")}
            >
              +{task.xp} XP{task.label && ` · ${task.label}`}
            </span>
          </li>
        );

        function handle(_el: HTMLElement, x: number, y: number) {
          const wasChecked = checked;
          const nowChecked = toggleTask(id, task.xp);
          if (nowChecked) {
            sound.check();
            effects.burst(x, y);
            if (task.xp > 0) effects.xpFloat(x, y - 18, task.xp);
          } else {
            sound.uncheck();
            if (task.xp > 0) effects.xpFloat(x, y - 18, -task.xp);
          }
          // Suppress unused-var warning
          void wasChecked;
          void toast;
        }
      })}
    </ul>
  );
}
