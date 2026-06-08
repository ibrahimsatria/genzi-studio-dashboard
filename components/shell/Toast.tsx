"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastFn = (head: string, sub?: string) => void;
const Ctx = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ head: string; sub?: string; key: number } | null>(null);
  const timer = useRef<number | null>(null);

  const show: ToastFn = useCallback((head, sub) => {
    if (timer.current) window.clearTimeout(timer.current);
    setState({ head, sub, key: Date.now() });
    timer.current = window.setTimeout(() => setState(null), 2600);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-6 right-6 z-[90] sm:bottom-8 sm:right-8"
      >
        {state && (
          <div
            key={state.key}
            className="min-w-[220px] rounded-xl border border-border-soft bg-bg-3 px-5 py-4 shadow-elev-3"
            style={{ animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1) forwards" }}
          >
            <div className="text-[13px] font-medium text-cream">{state.head}</div>
            {state.sub && (
              <div className="mt-1 font-mono text-xs text-brass">{state.sub}</div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes toastIn {
          from { transform: translateY(20px) scale(.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </Ctx.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
