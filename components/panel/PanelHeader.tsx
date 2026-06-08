import { PANEL_BY_ID, type PanelId } from "@/content/panels";

export function PanelHeader({ id, awardXp = 50 }: { id: PanelId; awardXp?: number | null }) {
  const p = PANEL_BY_ID[id];
  return (
    <header className="relative overflow-hidden border-b border-border-base px-6 pt-10 pb-9 sm:px-12 md:px-14 md:pt-14 md:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-80 w-80"
        style={{
          background:
            "radial-gradient(circle, rgba(212,165,116,.08) 0%, transparent 65%)",
        }}
      />
      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass-dim">
          {p.eyebrow}
        </div>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,2.4rem)] font-light leading-[1.1] tracking-[-0.015em] text-cream">
          {p.title}{" "}
          {p.titleEm && <em className="font-light italic text-brass">{p.titleEm}</em>}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-cream-mid">
          {p.description}
        </p>
        {awardXp != null && id !== "overview" && (
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-brass/20 bg-brass/8 px-3.5 py-1 font-mono text-[10px] text-brass">
            <span aria-hidden>✦</span> Read this section to earn +{awardXp} XP
          </span>
        )}
      </div>
    </header>
  );
}
