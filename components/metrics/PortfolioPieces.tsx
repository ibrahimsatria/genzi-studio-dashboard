"use client";

import { useState } from "react";
import { useMetrics, useMetricsActions } from "@/lib/metrics-store";
import { PORTFOLIO_GOAL_MIN, PORTFOLIO_GOAL_MAX } from "@/lib/metrics-types";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import { MetricCard, TextInput, PrimaryButton, FieldLabel } from "./ui";

export function PortfolioPieces() {
  const { portfolio } = useMetrics();
  const { addPortfolioPiece, togglePortfolioShipped, removePortfolioPiece } = useMetricsActions();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");

  const shippedCount = portfolio.filter((p) => p.shipped).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    addPortfolioPiece({ title: t, sector, shipped: false });
    sound.nav();
    setTitle("");
    setSector("");
  };

  const onToggle = (id: string, next: boolean) => {
    togglePortfolioShipped(id, next);
    sound.check();
    if (next) toast("Piece shipped", `${shippedCount + 1} of ${PORTFOLIO_GOAL_MAX}`);
  };

  return (
    <MetricCard className="p-0">
      <div className="flex flex-col gap-3 border-b border-border-base p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-[17px] font-light text-cream">Portfolio pieces</h3>
          <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
            {shippedCount} of {PORTFOLIO_GOAL_MAX} shipped · goal is {PORTFOLIO_GOAL_MIN}–{PORTFOLIO_GOAL_MAX} compelling pieces
          </p>
        </div>
      </div>

      <div className="p-5">
        <form
          onSubmit={submit}
          className="grid grid-cols-1 gap-2.5 rounded-lg border border-border-base bg-bg-3/60 p-3 sm:grid-cols-[1.6fr_1fr_auto]"
        >
          <label className="block">
            <FieldLabel>Piece title</FieldLabel>
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Kaizen Coffee rebrand" />
          </label>
          <label className="block">
            <FieldLabel>Sector (optional)</FieldLabel>
            <TextInput value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. F&B" />
          </label>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={!title.trim()}>
              Add piece
            </PrimaryButton>
          </div>
        </form>
      </div>

      {portfolio.length > 0 ? (
        <ul className="border-t border-border-base">
          {portfolio.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 border-b border-border-base px-5 py-3.5 last:border-b-0"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={p.shipped}
                onClick={() => onToggle(p.id, !p.shipped)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span
                  aria-hidden
                  className={[
                    "grid h-5 w-5 shrink-0 place-items-center rounded text-[11px] transition-all duration-250 ease-spring",
                    p.shipped
                      ? "scale-105 border-green bg-green text-white"
                      : "border border-border-soft text-transparent",
                  ].join(" ")}
                >
                  ✓
                </span>
                <span className="min-w-0">
                  <span
                    className={[
                      "block truncate text-[14px]",
                      p.shipped ? "text-cream-dim line-through decoration-cream-dim/40" : "text-cream",
                    ].join(" ")}
                  >
                    {p.title || "Untitled piece"}
                  </span>
                  <span className="font-mono text-[10px] text-cream-dim">
                    {p.shipped ? "Shipped" : "In progress"}
                    {p.sector ? ` · ${p.sector}` : ""}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => removePortfolioPiece(p.id)}
                aria-label="Delete piece"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border-base text-cream-dim transition-[transform,border-color,color] duration-200 ease-spring hover:border-sienna/40 hover:text-sienna active:scale-95"
              >
                <span aria-hidden className="text-[13px] leading-none">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-t border-border-base px-5 py-8 text-center font-mono text-[11px] text-cream-dim">
          No pieces yet. Add the ones you&apos;re building — check them off as you ship.
        </div>
      )}
    </MetricCard>
  );
}
