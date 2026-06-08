"use client";

import { createContext, useCallback, useContext, useRef } from "react";

// Lightweight particle + XP-float overlay system. Components anywhere in the
// tree call `useEffects().burst(x, y)` to fire particles at viewport coords.

type Effects = {
  burst: (x: number, y: number) => void;
  xpFloat: (x: number, y: number, amount: number) => void;
  flash: () => void;
};

const Ctx = createContext<Effects | null>(null);

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const burst = useCallback((cx: number, cy: number) => {
    const layer = layerRef.current;
    if (!layer) return;
    const colors = ["#d4a574", "#c45a3a", "#5aaa72", "#f0ead8"];
    const n = 14;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      const size = 4 + Math.random() * 4;
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 50 + Math.random() * 60;
      const dur = 0.7 + Math.random() * 0.4;
      p.style.cssText =
        `position:fixed;left:${cx}px;top:${cy}px;` +
        `width:${size}px;height:${size}px;border-radius:50%;` +
        `background:${colors[i % colors.length]};` +
        `pointer-events:none;z-index:80;` +
        `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;` +
        `animation:particleFly ${dur}s ease-out forwards;`;
      layer.appendChild(p);
      window.setTimeout(() => p.remove(), dur * 1000 + 100);
    }
  }, []);

  const xpFloat = useCallback((x: number, y: number, amount: number) => {
    const layer = layerRef.current;
    if (!layer) return;
    const el = document.createElement("div");
    const sign = amount >= 0 ? "+" : "−";
    el.textContent = `${sign}${Math.abs(amount)} XP`;
    const color =
      amount >= 0
        ? "color:var(--brass);text-shadow:0 0 12px rgba(212,165,116,.6);"
        : "color:var(--sienna);text-shadow:0 0 12px rgba(196,90,58,.5);";
    el.style.cssText =
      `position:fixed;left:${x}px;top:${y}px;` +
      `pointer-events:none;z-index:80;` +
      `font-family:var(--font-mono);font-size:16px;font-weight:600;` +
      `${color}` +
      `animation:xpPop .9s cubic-bezier(.22,1,.36,1) forwards;`;
    layer.appendChild(el);
    window.setTimeout(() => el.remove(), 1000);
  }, []);

  const flash = useCallback(() => {
    const f = flashRef.current;
    if (!f) return;
    f.style.opacity = "1";
    window.setTimeout(() => {
      if (f) f.style.opacity = "0";
    }, 180);
  }, []);

  return (
    <Ctx.Provider value={{ burst, xpFloat, flash }}>
      {children}
      <div ref={layerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[80]" />
      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] opacity-0 transition-opacity duration-150"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,165,116,.22), transparent 60%)",
        }}
      />
      <style jsx global>{`
        @keyframes particleFly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes xpPop {
          0% { opacity: 0; transform: translateY(0) scale(.6); }
          30% { opacity: 1; transform: translateY(-18px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(.9); }
        }
      `}</style>
    </Ctx.Provider>
  );
}

export function useEffects(): Effects {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEffects must be used inside EffectsProvider");
  return ctx;
}
