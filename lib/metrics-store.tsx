"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  type MetricsData,
  type PipelineEntry,
  type PipelineStage,
  type PortfolioPiece,
} from "@/lib/metrics-types";
import {
  createPipelineEntry,
  setPipelineStage as setPipelineStageAction,
  setPipelineDealValue as setPipelineDealValueAction,
  deletePipelineEntry as deletePipelineEntryAction,
  createPortfolioPiece,
  setPortfolioShipped as setPortfolioShippedAction,
  deletePortfolioPiece as deletePortfolioPieceAction,
} from "@/lib/metrics-server";

// Optimistic, list-oriented store. Mutations update local state immediately,
// fire the matching server action, and reconcile with the saved row (to pick
// up real ids / timestamps). On failure they roll the optimistic change back.

type NewPipelineInput = {
  businessName: string;
  channel: string;
  sector?: string;
  stage?: PipelineStage;
  dealValue?: number;
  notes?: string;
};

type NewPortfolioInput = {
  title: string;
  sector?: string;
  url?: string;
  shipped?: boolean;
};

type Actions = {
  addPipelineEntry: (input: NewPipelineInput) => void;
  setPipelineStage: (id: string, stage: PipelineStage, dealValue?: number) => void;
  setPipelineDealValue: (id: string, dealValue: number) => void;
  removePipelineEntry: (id: string) => void;
  addPortfolioPiece: (input: NewPortfolioInput) => void;
  togglePortfolioShipped: (id: string, shipped: boolean) => void;
  removePortfolioPiece: (id: string) => void;
};

const DataCtx = createContext<MetricsData | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

const tempId = () =>
  `tmp_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

const now = () => new Date().toISOString();

export function MetricsProvider({
  initial,
  children,
}: {
  initial: MetricsData;
  children: React.ReactNode;
}) {
  const [pipeline, setPipeline] = useState<PipelineEntry[]>(initial.pipeline);
  const [portfolio, setPortfolio] = useState<PortfolioPiece[]>(initial.portfolio);

  const actions = useMemo<Actions>(() => {
    return {
      addPipelineEntry(input) {
        const id = tempId();
        const stage = (input.stage ?? 1) as PipelineStage;
        const closing = stage === 5;
        const optimistic: PipelineEntry = {
          id,
          businessName: input.businessName.trim(),
          channel: input.channel,
          sector: input.sector?.trim() ?? "",
          stage,
          dealValue: closing ? Math.max(0, input.dealValue ?? 0) : 0,
          closedAt: closing ? now() : null,
          notes: input.notes?.trim() ?? "",
          createdAt: now(),
          updatedAt: now(),
        };
        setPipeline((prev) => [optimistic, ...prev]);
        createPipelineEntry(input)
          .then((saved) => {
            if (saved) {
              setPipeline((prev) => prev.map((e) => (e.id === id ? saved : e)));
            } else {
              setPipeline((prev) => prev.filter((e) => e.id !== id));
            }
          })
          .catch(() => setPipeline((prev) => prev.filter((e) => e.id !== id)));
      },

      setPipelineStage(id, stage, dealValue) {
        const closing = stage === 5;
        setPipeline((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  stage,
                  dealValue: closing ? (dealValue ?? e.dealValue) : 0,
                  closedAt: closing ? (e.closedAt ?? now()) : null,
                  updatedAt: now(),
                }
              : e,
          ),
        );
        if (id.startsWith("tmp_")) return; // server row not yet assigned
        setPipelineStageAction(id, stage, dealValue)
          .then((saved) => {
            if (saved) setPipeline((prev) => prev.map((e) => (e.id === id ? saved : e)));
          })
          .catch(() => {});
      },

      setPipelineDealValue(id, dealValue) {
        setPipeline((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, dealValue: Math.max(0, dealValue), updatedAt: now() } : e,
          ),
        );
        if (id.startsWith("tmp_")) return;
        setPipelineDealValueAction(id, dealValue)
          .then((saved) => {
            if (saved) setPipeline((prev) => prev.map((e) => (e.id === id ? saved : e)));
          })
          .catch(() => {});
      },

      removePipelineEntry(id) {
        let removed: PipelineEntry | undefined;
        setPipeline((prev) => {
          removed = prev.find((e) => e.id === id);
          return prev.filter((e) => e.id !== id);
        });
        if (id.startsWith("tmp_")) return;
        deletePipelineEntryAction(id).catch(() => {
          if (removed) setPipeline((prev) => [removed as PipelineEntry, ...prev]);
        });
      },

      addPortfolioPiece(input) {
        const id = tempId();
        const shipped = input.shipped ?? false;
        const optimistic: PortfolioPiece = {
          id,
          title: input.title.trim(),
          sector: input.sector?.trim() ?? "",
          url: input.url?.trim() ?? "",
          shipped,
          shippedAt: shipped ? now() : null,
          createdAt: now(),
          updatedAt: now(),
        };
        setPortfolio((prev) => [optimistic, ...prev]);
        createPortfolioPiece(input)
          .then((saved) => {
            if (saved) {
              setPortfolio((prev) => prev.map((p) => (p.id === id ? saved : p)));
            } else {
              setPortfolio((prev) => prev.filter((p) => p.id !== id));
            }
          })
          .catch(() => setPortfolio((prev) => prev.filter((p) => p.id !== id)));
      },

      togglePortfolioShipped(id, shipped) {
        setPortfolio((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, shipped, shippedAt: shipped ? (p.shippedAt ?? now()) : null, updatedAt: now() }
              : p,
          ),
        );
        if (id.startsWith("tmp_")) return;
        setPortfolioShippedAction(id, shipped)
          .then((saved) => {
            if (saved) setPortfolio((prev) => prev.map((p) => (p.id === id ? saved : p)));
          })
          .catch(() => {});
      },

      removePortfolioPiece(id) {
        let removed: PortfolioPiece | undefined;
        setPortfolio((prev) => {
          removed = prev.find((p) => p.id === id);
          return prev.filter((p) => p.id !== id);
        });
        if (id.startsWith("tmp_")) return;
        deletePortfolioPieceAction(id).catch(() => {
          if (removed) setPortfolio((prev) => [removed as PortfolioPiece, ...prev]);
        });
      },
    };
  }, []);

  const data = useMemo<MetricsData>(() => ({ pipeline, portfolio }), [pipeline, portfolio]);

  return (
    <ActionsCtx.Provider value={actions}>
      <DataCtx.Provider value={data}>{children}</DataCtx.Provider>
    </ActionsCtx.Provider>
  );
}

export function useMetrics(): MetricsData {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useMetrics must be used inside MetricsProvider");
  return ctx;
}

export function useMetricsActions(): Actions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error("useMetricsActions must be used inside MetricsProvider");
  return ctx;
}
