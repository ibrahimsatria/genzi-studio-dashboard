"use client";

import { useState } from "react";
import { useMetrics, useMetricsActions } from "@/lib/metrics-store";
import {
  CHANNELS,
  PIPELINE_STAGES,
  channelLabel,
  type PipelineEntry,
  type PipelineStage,
} from "@/lib/metrics-types";
import { formatBND } from "@/lib/metrics-derive";
import { useEffects } from "@/components/shell/Effects";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import { MetricCard, TextInput, Select, PrimaryButton, GhostButton, FieldLabel } from "./ui";

// ─── Add form ────────────────────────────────────────────────────────────────

function AddForm() {
  const { addPipelineEntry } = useMetricsActions();
  const [name, setName] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0].key);
  const [sector, setSector] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const businessName = name.trim();
    if (!businessName) return;
    addPipelineEntry({ businessName, channel, sector, stage: 1 });
    sound.check();
    setName("");
    setSector("");
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-2.5 rounded-lg border border-border-base bg-bg-3/60 p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
    >
      <label className="block">
        <FieldLabel>Business</FieldLabel>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kaizen Coffee" />
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
      <label className="block">
        <FieldLabel>Sector (optional)</FieldLabel>
        <TextInput value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. F&B" />
      </label>
      <div className="flex items-end">
        <PrimaryButton type="submit" disabled={!name.trim()}>
          Log DM
        </PrimaryButton>
      </div>
    </form>
  );
}

// ─── Stage stepper (5 clickable pips) ────────────────────────────────────────

function StagePips({
  entry,
  onSet,
}: {
  entry: PipelineEntry;
  onSet: (stage: PipelineStage) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {PIPELINE_STAGES.map((s) => {
        const reached = entry.stage >= s.stage;
        const isClosed = s.stage === 5 && reached;
        return (
          <button
            key={s.stage}
            type="button"
            onClick={() => onSet(s.stage)}
            title={s.label}
            aria-label={`Set stage: ${s.label}`}
            aria-pressed={entry.stage === s.stage}
            className="group relative grid h-6 w-6 place-items-center rounded-full transition-transform duration-200 ease-spring hover:scale-110 active:scale-95"
          >
            <span
              className="h-3 w-3 rounded-full border transition-colors duration-200"
              style={{
                borderColor: reached
                  ? isClosed
                    ? "var(--green)"
                    : "var(--brass)"
                  : "var(--border-light)",
                background: reached
                  ? isClosed
                    ? "var(--green)"
                    : "var(--brass)"
                  : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Deal-value editor (shown for closed deals) ──────────────────────────────

function DealValueField({ entry }: { entry: PipelineEntry }) {
  const { setPipelineDealValue } = useMetricsActions();
  const [val, setVal] = useState(String(entry.dealValue || ""));

  const commit = () => {
    const n = Math.max(0, Number(val.replace(/[^0-9.]/g, "")) || 0);
    if (n !== entry.dealValue) setPipelineDealValue(entry.id, n);
    setVal(n ? String(n) : "");
  };

  return (
    <label className="flex items-center gap-1.5">
      <span className="font-mono text-[10px] text-cream-dim">BND</span>
      <input
        inputMode="decimal"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        placeholder="0"
        className="w-24 rounded-md border border-green/30 bg-green/5 px-2 py-1 font-mono text-[12px] text-cream tabular-nums placeholder:text-cream-dim focus-visible:border-green/60"
      />
    </label>
  );
}

// ─── Entry row ───────────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: PipelineEntry }) {
  const { setPipelineStage, removePipelineEntry } = useMetricsActions();
  const effects = useEffects();
  const toast = useToast();

  const stageDef = PIPELINE_STAGES[entry.stage - 1];

  const handleSet = (stage: PipelineStage, ev: React.MouseEvent | null) => {
    if (stage === entry.stage) return;
    const closingNow = stage === 5 && entry.stage < 5;
    setPipelineStage(entry.id, stage);
    if (closingNow) {
      sound.levelUp();
      if (ev) effects.burst(ev.clientX, ev.clientY);
      else effects.flash();
      toast("Deal closed 🎉", `${entry.businessName || "Prospect"} — add the value`);
    } else {
      sound.nav();
    }
  };

  return (
    <li className="flex flex-col gap-3 border-b border-border-base px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium text-cream">
            {entry.businessName || <span className="text-cream-dim">Unnamed prospect</span>}
          </span>
          {entry.stage === 5 && (
            <span className="rounded-full bg-green/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-green">
              client
            </span>
          )}
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-cream-dim">
          {channelLabel(entry.channel)}
          {entry.sector ? ` · ${entry.sector}` : ""} · {stageDef.label}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div onClick={(e) => e.stopPropagation()}>
          <StagePips
            entry={entry}
            onSet={(stage) => handleSet(stage, null)}
          />
        </div>

        {/* Clickable wrapper so a deal-close burst originates at the cursor */}
        {entry.stage === 5 ? (
          <DealValueField entry={entry} />
        ) : (
          <GhostButton
            onClick={(e) => handleSet(5, e)}
            className="hidden sm:inline-flex"
          >
            Mark won
          </GhostButton>
        )}

        <button
          type="button"
          onClick={() => removePipelineEntry(entry.id)}
          aria-label="Delete entry"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border-base text-cream-dim transition-[transform,border-color,color] duration-200 ease-spring hover:border-sienna/40 hover:text-sienna active:scale-95"
        >
          <span aria-hidden className="text-[13px] leading-none">×</span>
        </button>
      </div>
    </li>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export function OutreachLog() {
  const { pipeline } = useMetrics();
  const closed = pipeline.filter((e) => e.stage === 5);
  const revenue = closed.reduce((s, e) => s + e.dealValue, 0);

  return (
    <MetricCard className="p-0">
      <div className="flex flex-col gap-3 border-b border-border-base p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-[17px] font-light text-cream">Outreach log</h3>
          <p className="mt-0.5 font-mono text-[10px] text-cream-dim">
            {pipeline.length === 0
              ? "Every prospect you contact lives here — it powers the funnel on your dashboard"
              : `${pipeline.length} tracked · ${closed.length} won · BND ${formatBND(revenue)}`}
          </p>
        </div>
      </div>

      <div className="p-5">
        <AddForm />
      </div>

      {pipeline.length > 0 ? (
        <ul className="border-t border-border-base">
          {pipeline.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <div className="border-t border-border-base px-5 py-8 text-center font-mono text-[11px] text-cream-dim">
          No prospects logged yet. Add your first above — advance it through the
          stages as conversations progress.
        </div>
      )}
    </MetricCard>
  );
}
