"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PANELS, TOTAL_TASKS, TOTAL_SECTIONS } from "@/content/panels";
import { useProgress, useProgressActions } from "@/lib/progress-store";
import { progressToNext } from "@/lib/xp";
import { sound } from "@/lib/audio";

export function Sidebar() {
  const progress = useProgress();
  const { setSoundEnabled, reset, setActivePanel } = useProgressActions();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    sound.setEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Sync sidebar's mobile drawer state with route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const { current, next, pct } = progressToNext(progress.xp);
  const sectionsReadCount = progress.sectionsRead.length;
  const tasksDoneCount = progress.checkedTasks.length;

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-base bg-bg/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div>
          <div className="font-display text-base font-light text-brass">Genzi Studio</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-dim">
            Growth OS · Lv {current.n} {current.name}
          </div>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border-soft text-cream-dim transition-[transform,color,border-color] duration-200 ease-spring hover:border-brass-dim hover:text-brass active:scale-95"
        >
          <span aria-hidden className="text-lg leading-none">{mobileOpen ? "✕" : "≡"}</span>
        </button>
      </header>

      {/* Sidebar (desktop) + mobile drawer */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto border-r border-border-base bg-[rgba(13,11,9,.96)] backdrop-blur-md transition-transform duration-300 ease-out-soft md:sticky md:top-0 md:z-10 md:h-screen md:w-64 md:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-elev-3" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        aria-label="Primary"
      >
        <div className="border-b border-border-base px-6 py-7">
          <div className="font-display text-xl font-light leading-tight text-brass">
            Genzi Studio
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-dim">
            Growth OS · Phase 1
          </div>
        </div>

        <div className="border-b border-border-base px-6 py-5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-cream-dim">
              Experience Points
            </span>
            <span className="rounded-full border border-brass/25 bg-brass/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-brass">
              Lv {current.n} · {current.name}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-700 ease-spring"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
            <strong className="font-semibold text-brass">{progress.xp} XP</strong>
            <span className="text-cream-dim">
              {next ? `/ ${next.need} next level` : "· max level"}
            </span>
          </div>
        </div>

        <nav className="px-2 py-4">
          <div className="px-4 pb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-dim">
            Sections
          </div>
          <ul className="flex flex-col gap-0.5">
            {PANELS.map((p) => {
              const active = pathname === p.href;
              const done = progress.sectionsRead.includes(p.id);
              return (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    onClick={() => {
                      sound.nav();
                      setActivePanel(p.id);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-[background-color,color] duration-150 ease-out-soft",
                      active
                        ? "bg-brass/10 text-brass"
                        : "text-cream-dim hover:bg-bg-3 hover:text-cream-mid",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "flex h-5 w-5 items-center justify-center text-[15px] leading-none",
                        active ? "text-brass" : "text-cream-dim group-hover:text-cream-mid",
                      ].join(" ")}
                    >
                      {p.icon}
                    </span>
                    <span className="flex-1">{p.label}</span>
                    {done && (
                      <span className="rounded-full bg-green/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-green">
                        done
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-border-base px-6 py-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/25 bg-green/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-green">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-green"
              style={{ animation: "pulse-dot 2s infinite" }}
            />
            Phase 1 Active
          </span>
          <div className="mt-3 text-xs text-cream-dim">
            Sections read: <strong className="font-medium text-cream">{sectionsReadCount}</strong>{" "}
            / {TOTAL_SECTIONS - 1}
          </div>
          <div className="text-xs text-cream-dim">
            Tasks done: <strong className="font-medium text-cream">{tasksDoneCount}</strong>{" "}
            / {TOTAL_TASKS}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!progress.soundEnabled)}
              aria-pressed={!progress.soundEnabled}
              className={[
                "flex h-8 items-center justify-center rounded-md border font-mono text-[9px] uppercase tracking-[0.1em] transition-[transform,border-color,color] duration-200 ease-spring active:scale-95",
                progress.soundEnabled
                  ? "border-border-base text-cream-dim hover:border-brass-dim hover:text-brass"
                  : "border-sienna-dim/40 text-sienna-dim hover:text-sienna",
              ].join(" ")}
            >
              {progress.soundEnabled ? "♪ Sound" : "Muted"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all progress? This clears your XP, completed tasks, and sections read.")) {
                  reset();
                }
              }}
              className="flex h-8 items-center justify-center rounded-md border border-border-base font-mono text-[9px] uppercase tracking-[0.1em] text-cream-dim transition-[transform,border-color,color] duration-200 ease-spring hover:border-brass-dim hover:text-brass active:scale-95"
            >
              ↺ Reset
            </button>
          </div>

          <form action="/auth/sign-out" method="post" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-md border border-border-base px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-cream-dim transition-[transform,border-color,color] duration-200 ease-spring hover:border-brass-dim hover:text-brass active:scale-95"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
