"use client";

import { useEffect, useRef } from "react";

// Animated constellation background — same effect as the original HTML.
// 55 brass-tinted dots drifting; lines connect when within 140px.
export function BgCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;
    let dots: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];

    function resize() {
      if (!cvs) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width = w + "px";
      cvs.style.height = h + "px";
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 720 ? 30 : 55;
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.7 + Math.random() * 1.3,
      }));
    }

    let raf = 0;
    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(212,165,116,${(0.12 * (1 - d / 140)).toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(212,165,116,0.55)";
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-45"
    />
  );
}
