"use client";

import { useState, type ReactNode } from "react";
import { sound } from "@/lib/audio";

export function Expandable({
  num,
  title,
  children,
}: {
  num: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2.5 overflow-hidden rounded-xl border border-border-base transition-colors duration-200 hover:border-border-soft">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          sound.exp();
        }}
        aria-expanded={open}
        className={[
          "flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-200",
          open ? "bg-bg-3 border-b border-border-base" : "bg-bg-2 hover:bg-bg-3",
        ].join(" ")}
      >
        <span className="flex items-center gap-3.5">
          <span className="min-w-[22px] font-mono text-[10px] text-brass-dim">
            {num}
          </span>
          <span className="text-[15px] font-medium leading-tight text-cream">
            {title}
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0 text-[11px] text-cream-dim transition-transform duration-200 ease-spring"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          className="bg-bg-2 px-6 py-6 sm:pl-[60px] sm:pr-7"
          style={{ animation: "expandIn .2s ease forwards" }}
        >
          <div className="space-y-3.5 text-[14px] leading-[1.8] text-cream-mid [&_strong]:font-semibold [&_strong]:text-cream">
            {children}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
