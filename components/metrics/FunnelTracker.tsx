"use client";

import { useRef, useState } from "react";
import { useMetrics, useMetricsActions } from "@/lib/metrics-store";
import { buildFunnel, formatPct } from "@/lib/metrics-derive";
import { CHANNELS } from "@/lib/metrics-types";
import { useEffects } from "@/components/shell/Effects";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import { MetricCard, TextInput, Select, PrimaryButton, GhostButton, FieldLabel } from "./ui";

export function FunnelTracker() {
  const { pipeline } = useMetrics();
  const { addPipelineEntry } = useMetricsActions();
  const effects = useEffects();
  const toast = useToast();

  const funnel = buildFunnel(pipeline);
  const top = funnel.steps[0].count;
  const max = Math.max(1, top);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0].key);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const businessName = name.trim();
    if (!businessName) return;
    addPipelineEntry({ businessName, channel, stage: 1 });
    sound.check();
    const r = formRef.current?.getBoundingClientRect();
    if (r) effects.burst(r.left + r.width / 2, r.top);
    toast("DM logged", `${businessName} entered the funnel`);
    setName("");
    setOpen(false);
  };

  return (
    <MetricCard>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[17px] font-light text-cream">Pipeline funnel</h3>
          <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
            {top === 0
              ? "Log a DM to start tracking conversion"
              : `${formatPct(funnel.overall)} overall — DM to closed`}
          </p>
        </div>
        <GhostButton onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Cancel" : "＋ Log a DM"}
        </GhostButton>
      </div>

      {open && (
        <form
          ref={formRef}
          onSubmit={submit}
          className="mb-5 grid grid-cols-1 gap-2.5 rounded-lg border border-border-base bg-bg-3/60 p-3 sm:grid-cols-[1fr_auto_auto]"
        >
          <label className="block">
            <FieldLabel>Business</FieldLabel>
            <TextInput
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kaizen Coffee"
            />
          </label>
          <label className="block">
            <FieldLabel>Channel</FieldLabel>
            <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
              {CHANNELS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </Select>
          </label>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={!name.trim()}>
              Add
            </PrimaryButton>
          </div>
        </form>
      )}

      <ol className="flex flex-col gap-2.5">
        {funnel.steps.map((step, i) => {
          const widthPct = Math.max(4, (step.count / max) * 100);
          return (
            <li key={step.key}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream-mid">
                  {step.label}
                </span>
                <span className="flex items-baseline gap-2">
                  {step.conversion != null && (
                    <span className="font-mono text-[10px] text-brass-dim">
                      {formatPct(step.conversion)} →
                    </span>
                  )}
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-cream">
                    {step.count}
                  </span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-bg-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sienna to-brass transition-[width] duration-700 ease-spring"
                  style={{
                    width: `${widthPct}%`,
                    opacity: 0.45 + (1 - i / (funnel.steps.length - 1)) * 0.55,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </MetricCard>
  );
}
