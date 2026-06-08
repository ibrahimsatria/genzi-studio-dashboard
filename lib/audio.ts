"use client";

// Web Audio engine — synthesized tones, no external assets.
// Lazy AudioContext: only created on first interaction (browsers require gesture).

let ac: AudioContext | null = null;
let enabled = true;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ac) {
    const Win = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctor = window.AudioContext || Win.webkitAudioContext;
    if (!Ctor) return null;
    ac = new Ctor();
  }
  if (ac.state === "suspended") ac.resume().catch(() => {});
  return ac;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.16,
  delay = 0,
) {
  if (!enabled) return;
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(c.destination);
  const t0 = c.currentTime + delay;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sound = {
  setEnabled(v: boolean) {
    enabled = v;
  },
  isEnabled() {
    return enabled;
  },
  unlock() {
    ctx();
  },
  check() {
    tone(880, 0.12, "sine", 0.15);
    tone(1320, 0.14, "sine", 0.1, 0.04);
  },
  uncheck() {
    tone(440, 0.07, "sine", 0.07);
    tone(330, 0.09, "sine", 0.05, 0.03);
  },
  section() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(f, 0.35, "triangle", 0.13, i * 0.06),
    );
  },
  levelUp() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      tone(f, 0.4, "triangle", 0.17, i * 0.09),
    );
    tone(1568, 0.8, "sine", 0.11, 0.55);
  },
  nav() {
    tone(440, 0.06, "sine", 0.07);
  },
  exp() {
    tone(660, 0.04, "sine", 0.05);
  },
};
