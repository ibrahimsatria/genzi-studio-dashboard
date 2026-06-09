import {
  PanelHeader,
  SectionLabel,
  Quote,
  Grid,
  Card,
  Expandable,
  Checklist,
  SectionTracker,
  WhenThisGoesWrong,
} from "@/components/panel";
import { PortfolioPieces } from "@/components/metrics";
import { PANEL_TASKS } from "@/content/tasks";

export default function PortfolioPage() {
  return (
    <>
      <PanelHeader id="portfolio" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <Quote cite="The standard that separates professionals from practitioners">
          A portfolio piece is not a beautiful design. It is a story with a problem, a strategy,
          and a result. The design is the evidence.
        </Quote>

        <SectionLabel>The 3 sources of portfolio work</SectionLabel>
        <Grid cols={3}>
          <Card
            eyebrow="Source 1"
            title="Spec work"
            body="Design for a real business without being hired. You pick the client, write the brief, control all creative decisions, own all rights. Zero dependency on anyone's schedule or budget."
            tag="Best for: speed and creative control"
          />
          <Card
            eyebrow="Source 2"
            title="Discounted real work"
            body="1–2 real clients at a reduced rate in exchange for full publishing rights and a written testimonial. Gets you real case studies with real relationships behind them."
            tag="Best for: testimonials and credibility"
          />
          <Card
            eyebrow="Source 3"
            title="Personal projects"
            body="Design something that matters to you — your own agency brand, a concept brand for a sector you want to serve. Shows passion, range, and where your aesthetic instincts naturally go."
            tag="Best for: showing your aesthetic range"
          />
        </Grid>

        <SectionLabel>What separates strong work from weak work</SectionLabel>
        <Expandable num="✗" title="Weak: gallery of final outputs">
          <p>
            A logo on a white background. Three mockups on phone screens. Maybe a colour palette.
            This is what 90% of new designers put in their portfolio. It tells a prospective client
            nothing about how you think, what problem you were solving, whether you can handle a
            real engagement, or whether the design decision was yours or the client&apos;s.
          </p>
          <p>
            <strong>The question it fails to answer:</strong> &ldquo;Can I trust this person to
            understand my business and make the right decisions?&rdquo; Without strategic context,
            the answer is always uncertain.
          </p>
        </Expandable>
        <Expandable num="✓" title="Strong: narrative case study with problem and result">
          <p>
            A case study follows this structure: <strong>1. The business and its problem</strong> —
            who they are, who they serve, what their current branding fails to communicate.{" "}
            <strong>2. Your strategic direction</strong> — what you decided to do and why. What you
            rejected and why. <strong>3. The work</strong> — the complete visual system.{" "}
            <strong>4. The outcome</strong> — what changed or what would change if this were
            implemented in full.
          </p>
          <p>
            For spec work, the &ldquo;outcome&rdquo; section can be forward-looking: &ldquo;A
            coherent brand identity that would allow [Business] to charge a premium and attract a
            more discerning customer.&rdquo; That&apos;s honest and still compelling to a prospective
            client in the same sector.
          </p>
          <p>
            <strong>The before/after contrast is your most powerful single tool.</strong> A
            screenshot of their current Instagram next to your redesigned concept — the gap does
            the selling for you before you&apos;ve said a word.
          </p>
        </Expandable>

        <WhenThisGoesWrong
          intro="The portfolio trap isn't bad design — it's building the wrong proof, slowly. Watch for these."
          items={[
            {
              scenario: "You have eight half-finished concepts and zero complete case studies.",
              fix: (
                <>
                  Eight logos is not a portfolio; it&apos;s a graveyard. A prospective client needs to
                  see one <strong>complete, narrated piece</strong> far more than eight pretty
                  fragments. Pick the three closest to done, finish them fully — brief, system,
                  mockups, written case study — and ship those before starting anything new.
                </>
              ),
            },
            {
              scenario: "All your pieces are in different sectors, so no single client sees themselves.",
              fix: (
                <>
                  Range feels impressive to you and reads as unfocused to a buyer. If you want F&amp;B
                  clients, <strong>concentrate your spec work in F&amp;B</strong>. Three pieces in one
                  sector make you look like the specialist for that sector — which is exactly the
                  story that converts in a market as small as BSB.
                </>
              ),
            },
          ]}
        />

        <SectionLabel>Track your pieces toward the 3–5 goal</SectionLabel>
        <PortfolioPieces />

        <SectionLabel>Full deliverables list — what a complete piece includes</SectionLabel>
        <Checklist panelId="portfolio" tasks={PANEL_TASKS.portfolio} />

        <SectionLabel>Best target businesses in Brunei right now</SectionLabel>
        <Grid cols={2}>
          <Card
            eyebrow="Highest priority"
            title="F&B — cafés and kopitiams"
            body="Abundant in BSB. Most have no visual coherence. Food and drink brands make naturally beautiful portfolio pieces because the applications — packaging, menus, signage, social content — are inherently photogenic. A before/after story is easy to tell and relatable to any future F&B client."
          />
          <Card
            eyebrow="Highest priority"
            title="Service businesses"
            body="Tutoring centres, salons, clinics, accounting firms. These sectors have real budgets, branding directly impacts their ability to charge premium prices, and almost all of them have visibly DIY-looking identity. The upgrade story practically writes itself."
          />
          <Card
            eyebrow="Good option"
            title="Retail and night market vendors"
            body="Vendors who have grown beyond a stall but have no brand infrastructure. They're often open to new ideas because they're in active growth mode and they know their visual identity hasn't kept pace with the business."
          />
          <Card
            eyebrow="Good option"
            title="New businesses launching"
            body="A business that just started has no brand baggage. You can create something from scratch and show the full ideation process — which is the most compelling type of case study to show a prospective client facing the same blank-canvas situation."
          />
        </Grid>
      </div>
      <SectionTracker panelId="portfolio" />
    </>
  );
}
