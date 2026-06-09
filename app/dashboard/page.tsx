import { PanelHeader, HeroBlock, SectionLabel, SectionTracker } from "@/components/panel";
import { OverallProgress, NavCards } from "@/components/panel/OverviewBlocks";
import { MetricCounters, FunnelTracker, PortfolioTracker } from "@/components/metrics";
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

export default function OverviewPage() {
  return (
    <>
      <PanelHeader id="overview" awardXp={null} />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <HeroBlock
          title="The core"
          titleEm="problem we're solving"
          body="You're in a credibility chicken-and-egg trap: clients want proof, but you need clients to build proof. The way out is to manufacture proof first — then use it to attract clients systematically. That's exactly what this OS is built to guide you through."
        />
        <OverallProgress />

        <SectionLabel>Your numbers</SectionLabel>
        <MetricCounters />

        <SectionLabel>Pipeline &amp; portfolio</SectionLabel>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <FunnelTracker />
          <PortfolioTracker />
        </div>

        <SectionLabel>Jump to a section</SectionLabel>
        <NavCards subtitles={NAV_SUBTITLES} />
      </div>
      <SectionTracker panelId="overview" />
    </>
  );
}
