"use client";

import { useState } from "react";
import { useMetrics, useMetricsActions } from "@/lib/metrics-store";
import { shippedPieces } from "@/lib/metrics-derive";
import { PORTFOLIO_GOAL_MIN, PORTFOLIO_GOAL_MAX } from "@/lib/metrics-types";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import { MetricCard, TextInput, PrimaryButton, GhostButton } from "./ui";

export function PortfolioTracker() {
  const { portfolio } = useMetrics();
  const { addPortfolioPiece } = useMetricsActions();
  const toast = useToast();

  const shipped = shippedPieces(portfolio);
  const count = shipped.length;
  const segments = Math.max(PORTFOLIO_GOAL_MAX, count);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    addPortfolioPiece({ title: t, shipped: true });
    sound.check();
    toast("Portfolio piece shipped", `${count + 1} of ${PORTFOLIO_GOAL_MAX}`);
    setTitle("");
    setOpen(false);
  };

  const reachedGoal = count >= PORTFOLIO_GOAL_MIN;

  return (
    <MetricCard>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[17px] font-light text-cream">Portfolio shipped</h3>
          <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
            {reachedGoal
              ? `Goal hit — ${count} pieces and counting`
              : `${PORTFOLIO_GOAL_MIN - count} more to reach the ${PORTFOLIO_GOAL_MIN}–${PORTFOLIO_GOAL_MAX} goal`}
          </p>
        </div>
        <GhostButton onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Cancel" : "＋ Add piece"}
        </GhostButton>
      </div>

      {open && (
        <form onSubmit={submit} className="mb-5 flex flex-col gap-2.5 rounded-lg border border-border-base bg-bg-3/60 p-3 sm:flex-row">
          <TextInput
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Piece title — e.g. Kaizen Coffee rebrand"
          />
          <PrimaryButton type="submit" disabled={!title.trim()} className="shrink-0">
            Mark shipped
          </PrimaryButton>
        </form>
      )}

      <div className="flex items-end gap-3">
        <div className="font-display text-[2.6rem] font-light leading-none text-brass tabular-nums">
          {count}
          <span className="ml-1 align-baseline font-mono text-[13px] text-cream-dim">
            / {PORTFOLIO_GOAL_MAX}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden>
        {Array.from({ length: segments }).map((_, i) => {
          const filled = i < count;
          const beyondGoal = i >= PORTFOLIO_GOAL_MAX;
          return (
            <div
              key={i}
              className="h-2.5 flex-1 rounded-full transition-[background-color] duration-500"
              style={{
                background: filled
                  ? beyondGoal
                    ? "var(--green)"
                    : "linear-gradient(90deg, var(--sienna), var(--brass))"
                  : "var(--bg4)",
              }}
            />
          );
        })}
      </div>

      {shipped.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {shipped.slice(0, 6).map((p) => (
            <li
              key={p.id}
              className="rounded-full border border-border-base bg-bg-3 px-2.5 py-1 font-mono text-[10px] text-cream-mid"
            >
              {p.title || "Untitled"}
            </li>
          ))}
          {shipped.length > 6 && (
            <li className="rounded-full px-2.5 py-1 font-mono text-[10px] text-cream-dim">
              +{shipped.length - 6} more
            </li>
          )}
        </ul>
      )}
    </MetricCard>
  );
}
