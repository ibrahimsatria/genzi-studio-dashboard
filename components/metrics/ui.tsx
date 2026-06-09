"use client";

import { type ReactNode } from "react";

// Small form primitives styled to the Genzi design system. Kept here so the
// metrics surfaces share one consistent input/button language.

export const inputCls =
  "w-full rounded-lg border border-border-base bg-bg-3 px-3 py-2 text-[13px] text-cream placeholder:text-cream-dim transition-colors duration-150 focus-visible:border-brass-dim";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode },
) {
  const { children, className, ...rest } = props;
  return (
    <select {...rest} className={`${inputCls} appearance-none ${className ?? ""}`}>
      {children}
    </select>
  );
}

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded-lg border border-brass/30 bg-brass/10 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-brass",
        "transition-[transform,background-color,border-color] duration-200 ease-spring hover:border-brass/50 hover:bg-brass/15 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        rest.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded-md border border-border-base px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cream-dim",
        "transition-[transform,border-color,color] duration-200 ease-spring hover:border-brass-dim hover:text-brass active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border-base disabled:hover:text-cream-dim disabled:active:scale-100",
        rest.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-cream-dim">
      {children}
    </span>
  );
}

// Section wrapper that matches the dashboard's card language.
export function MetricCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-border-base bg-bg-2 p-5 sm:p-6 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
