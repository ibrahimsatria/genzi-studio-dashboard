"use client";

import { useEffect, useState } from "react";
import { useProgressActions } from "@/lib/progress-store";
import { useEffects } from "@/components/shell/Effects";
import { sound } from "@/lib/audio";
import { LEVELS } from "@/lib/xp";

export function LevelUpOverlay() {
  const [level, setLevel] = useState<number | null>(null);
  const { onLevelUp } = useProgressActions();
  const effects = useEffects();

  useEffect(() => {
    const unsub = onLevelUp((lv) => {
      setLevel(lv);
      sound.levelUp();
      // confetti
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      window.setTimeout(() => effects.burst(cx, cy), 50);
      window.setTimeout(() => effects.burst(cx - 80, cy), 200);
      window.setTimeout(() => effects.burst(cx + 80, cy), 350);
    });
    return unsub;
  }, [onLevelUp, effects]);

  useEffect(() => {
    if (level == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLevel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level]);

  if (level == null) return null;
  const cur = LEVELS.find((l) => l.n === level);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setLevel(null)}
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-bg/85 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        <Ring delay="0s" size={300} />
        <Ring delay=".4s" size={400} />
        <Ring delay=".8s" size={500} />
        <div
          className="relative z-10 text-center"
          style={{ animation: "lvlIn .5s cubic-bezier(.34,1.56,.64,1) forwards" }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass-dim">
            Level Up
          </div>
          <div
            className="font-display text-[96px] font-bold leading-none text-brass"
            style={{ textShadow: "0 0 60px rgba(212,165,116,.4)" }}
          >
            {level}
          </div>
          <div className="mt-2 font-display text-2xl font-light italic text-cream">
            {cur?.name}
          </div>
          <div className="mt-7 inline-block rounded-full border border-border-soft px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-cream-dim transition-colors duration-200 hover:border-brass-dim hover:text-brass">
            Tap to continue
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes lvlIn {
          from { transform: scale(.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Ring({ size, delay }: { size: number; delay: string }) {
  return (
    <div
      aria-hidden
      className="absolute rounded-full border border-brass/15"
      style={{
        width: size,
        height: size,
        animation: `ringPulse 1.5s ease-out ${delay} infinite`,
      }}
    >
      <style jsx>{`
        @keyframes ringPulse {
          0% { opacity: .5; transform: scale(.5); }
          100% { opacity: 0; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
