import { SectionLabel, SectionTracker } from "@/components/panel";
import { NavCards } from "@/components/panel/OverviewBlocks";
import { MetricCounters, FunnelTracker, PortfolioTracker } from "@/components/metrics";
import {
  TimeIndicator,
  PhasePanel,
  WeeklyActions,
  RhythmStreaks,
  MomentumStrip,
} from "@/components/home";
import type { PanelId } from "@/content/panels";

const NAV_SUBTITLES: Record<PanelId, string> = {
  overview: "",
  roadmap:
    "Build proof → activate channels → scale and convert. Your complete timeline from today to recurring revenue.",
  portfolio:
    "From zero proof to 3–5 compelling pieces. What makes a portfolio piece work, what sectors to target in Brunei.",
  pricing:
    "The 3-tier deal structure for free and discounted work. How to frame it so it builds your reputation, not devalues it.",
  specwork:
    "The full 5-stage system to create portfolio pieces without a client — and turn each one into a real door opener.",
  personalbrand:
    "How ibrahimsatria._ drives clients to Genzi Studio. The 3 content pillars and the conversion funnel between your accounts.",
  outreach:
    "Discovery-first outreach for Brunei SMEs. The scripts, sectors, and sequences that start real conversations without cold-pitching.",
};

export default function HomePage() {
  return (
    <>
      {/* Command-center header */}
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
            Mission Control
          </div>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,2.4rem)] font-light leading-[1.1] tracking-[-0.015em] text-cream">
            Today at <em className="font-light italic text-brass">Genzi Studio</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-cream-mid">
            Your daily command center — where you are in time, what to do this week, and how the
            numbers are actually moving. The full playbook lives in the reference library below.
          </p>
        </div>
      </header>

      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        {/* ── Today: orientation ── */}
        <SectionLabel>Today · where you are</SectionLabel>
        <div className="flex flex-col gap-3">
          <TimeIndicator />
          <PhasePanel />
        </div>

        {/* ── This week: the work ── */}
        <SectionLabel>This week&apos;s focus</SectionLabel>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <WeeklyActions />
          <RhythmStreaks />
        </div>
        <div className="mt-3">
          <MomentumStrip />
        </div>

        {/* ── How I'm tracking: outcomes ── */}
        <SectionLabel>How I&apos;m tracking</SectionLabel>
        <MetricCounters />
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <FunnelTracker />
          <PortfolioTracker />
        </div>

        {/* ── Reference: the educational playbook, moved behind ── */}
        <SectionLabel>Reference library</SectionLabel>
        <p className="mb-5 -mt-2 text-[13px] leading-[1.7] text-cream-mid">
          The strategy behind every number above. Read a section to earn XP — return here to act on it.
        </p>
        <NavCards subtitles={NAV_SUBTITLES} />
      </div>

      <SectionTracker panelId="overview" />
    </>
  );
}
