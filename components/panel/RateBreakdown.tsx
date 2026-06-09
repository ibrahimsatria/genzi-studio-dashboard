import { type ReactNode } from "react";

export type BreakdownRow = {
  label: ReactNode;
  value: string;
  // Visual role: a running subtotal, the final total, or a plain line.
  kind?: "line" | "subtotal" | "total";
  note?: string;
};

// A compact, mono "quote math" table for unit-economics worked examples.
export function RateBreakdown({
  title,
  rows,
  footnote,
}: {
  title?: string;
  rows: BreakdownRow[];
  footnote?: ReactNode;
}) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border-base bg-bg-2">
      {title && (
        <div className="border-b border-border-base px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brass-dim">
          {title}
        </div>
      )}
      <dl className="divide-y divide-border-base">
        {rows.map((row, i) => {
          const isTotal = row.kind === "total";
          const isSub = row.kind === "subtotal";
          return (
            <div
              key={i}
              className={[
                "flex items-baseline justify-between gap-4 px-5 py-3",
                isTotal ? "bg-brass/[0.05]" : isSub ? "bg-bg-3/40" : "",
              ].join(" ")}
            >
              <dt
                className={[
                  "text-[13px] leading-snug",
                  isTotal ? "font-medium text-cream" : "text-cream-mid",
                ].join(" ")}
              >
                {row.label}
                {row.note && (
                  <span className="ml-2 font-mono text-[10px] text-cream-dim">{row.note}</span>
                )}
              </dt>
              <dd
                className={[
                  "shrink-0 font-mono tabular-nums",
                  isTotal
                    ? "text-[15px] font-semibold text-brass"
                    : isSub
                      ? "text-[13px] text-cream"
                      : "text-[13px] text-cream-mid",
                ].join(" ")}
              >
                {row.value}
              </dd>
            </div>
          );
        })}
      </dl>
      {footnote && (
        <div className="border-t border-border-base px-5 py-3 text-[12px] leading-[1.6] text-cream-mid [&_strong]:font-semibold [&_strong]:text-cream">
          {footnote}
        </div>
      )}
    </div>
  );
}
