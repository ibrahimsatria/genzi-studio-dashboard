import {
  PanelHeader,
  SectionLabel,
  Body,
  Quote,
  Expandable,
  Checklist,
  SectionTracker,
} from "@/components/panel";
import { RoadmapPhaseRow, PhaseGate } from "@/components/roadmap/RoadmapPhases";
import { WhenThisGoesWrong } from "@/components/panel/WhenThisGoesWrong";
import { RateBreakdown } from "@/components/panel/RateBreakdown";
import { PANEL_TASKS } from "@/content/tasks";

export default function RoadmapPage() {
  return (
    <>
      <PanelHeader id="roadmap" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <RoadmapPhaseRow />

        <SectionLabel>Phase 1 — Build proof without waiting for paying clients</SectionLabel>
        <Body>
          You&apos;re trying to sell from zero proof. The fastest fix is to manufacture proof across
          three parallel tracks — spec work, discounted real work, and live documentation. You
          don&apos;t need a client to start any of them.
        </Body>

        <Expandable num="1.1" title="Spec work — 3 local business rebrands">
          <p>
            Pick 3 businesses in Brunei with visibly poor branding — a kopitiam, a retail shop, a
            service business like a tutoring centre or salon. Design their complete brand identity
            as if you were hired: logo system, colour palette, type pairing, application mockups,
            social templates. No permission needed. You own all rights. You get full creative
            control.
          </p>
          <p>
            <strong>Why it works:</strong> You get portfolio pieces with zero dependency on anyone
            else&apos;s timeline or budget. And once the piece is done, you can DM the real business
            — turning passive portfolio work into active prospecting simultaneously.
          </p>
          <p>
            <strong>Best targets in BSB:</strong> F&amp;B spots with no visual coherence, night
            market vendors that have grown beyond a stall, service businesses with DIY-looking
            identity, new businesses that just launched with no brand at all.
          </p>
        </Expandable>

        <Expandable num="1.2" title="1–2 real clients at introductory rate">
          <p>
            Take on 1–2 real businesses at 50–70% off your future rate, framed as an &ldquo;introductory
            partnership&rdquo; — not charity. The discount is specific to this first project only. In
            exchange: you control the creative direction, you get full publishing rights in
            writing, and you get a written testimonial on delivery day.
          </p>
          <p>
            <strong>Why charge something:</strong> Even BND 150–300 completely changes the dynamic.
            Clients who pay show up to feedback calls, respond to messages, make decisions on time,
            and respect your process. Free clients ghost, delay, and become demanding because they
            feel they have nothing at stake.
          </p>
          <p>
            <strong>Hard rules:</strong> Cap at 2 clients at this rate. State clearly upfront that
            the next project is at your standard rate. Clients who push back on that are exactly
            who you want to filter out at this stage.
          </p>
        </Expandable>

        <Expandable num="1.3" title="Document everything publicly in real time">
          <p>
            Your personal Instagram (ibrahimsatria._) is where this happens. Post the process —
            not just the polished final output. Brief → concept exploration → revision → result.
            Show what got rejected and why. This builds authority faster than a finished portfolio
            because it&apos;s live proof you know how to think through a problem.
          </p>
          <p>
            <strong>Goal by end of Phase 1:</strong> 3–5 portfolio pieces, 2–3 real testimonials, a
            case study format you can repeat for every future project automatically.
          </p>
        </Expandable>

        <SectionLabel>Phase 2 — Activate your channels (Month 1–3)</SectionLabel>
        <PhaseGate phase={2}>
        <Body>
          Once you have 3–5 pieces and 2–3 testimonials, you have something to point at. Now you
          run two tracks simultaneously — digital presence and direct outreach. Both feed each
          other.
        </Body>

        <Expandable num="2.1" title="Two-account Instagram strategy">
          <p>
            <strong>@genzistudio</strong> posts results: before/afters, case studies, transformation
            stories, and the agency&apos;s strategic POV on branding. This is credibility content — for
            people already looking for a creative agency.
          </p>
          <p>
            <strong>@ibrahimsatria._</strong> posts perspective: why local SME branding fails, what
            growth looks like in Brunei, founder journey, sharp opinions. This is trust content —
            for people who buy into you before they know the agency exists.
          </p>
          <p>
            Always link the two accounts clearly. The personal account is the top of the funnel.
            The agency account is where trust converts to enquiry. This is why both need consistent
            activity, and your bio on both should point to the other.
          </p>
        </Expandable>

        <Expandable num="2.2" title="Direct outreach — lead with observation, not pitch">
          <p>
            Target F&amp;B, retail, and professional services (legal, medical, accounting) — they
            have real budgets and visible branding problems. Lead with a specific observation about
            their business, not a generic service pitch:
          </p>
          <Quote>
            &ldquo;I noticed your Instagram hasn&apos;t been updated in 3 months — I had a few specific
            ideas for your business. Would you be open to a 20-minute conversation?&rdquo;
          </Quote>
          <p>
            This frames you as someone who did their homework, not someone mass-DMing with a
            template. In Brunei&apos;s small, relationship-driven market, that distinction matters
            enormously.
          </p>
        </Expandable>

        <Expandable num="2.3" title="LinkedIn + local networking">
          <p>
            LinkedIn is underused in Brunei — which is your advantage. Post the same strategic
            perspective content you&apos;d put on your personal Instagram, but in a longer-form B2B
            register. Business owners in BSB are increasingly active here. One good post per week
            is enough to become the most visible young creative strategist in the local feed.
          </p>
          <p>
            For local networking: the Brunei Chinese Chamber of Commerce, BEDB events, youth
            entrepreneurship groups. In a market this small, one warm introduction from the right
            person can open five doors. You don&apos;t need advertising. You need to be consistently
            visible at the right places.
          </p>
          <p>
            <strong>Goal by end of Phase 2:</strong> 2–3 genuine discovery conversations per week,
            1 paid client per month minimum.
          </p>
        </Expandable>

        </PhaseGate>

        <SectionLabel>Phase 3 — Scale and convert (Month 3+)</SectionLabel>
        <PhaseGate phase={3}>

        <Expandable num="3.1" title="Package your services into clear offers">
          <p>Stop selling time. Start selling outcomes. Three tiers work well for Brunei SMEs:</p>
          <p>
            <strong>Brand Starter:</strong> Logo + brand guide + social templates. One-time project.
            Entry point for smaller businesses or those skeptical about investing in brand.
          </p>
          <p>
            <strong>Brand Growth:</strong> Full identity + 3 months of content strategy and social
            management. Mid-tier. The sweet spot for F&amp;B and retail.
          </p>
          <p>
            <strong>Brand Scale:</strong> Complete identity + ongoing retainer — strategy, content,
            reporting, optimisation. Highest value, highest relationship. This is where your real
            revenue comes from.
          </p>
          <p>
            Clear packages remove the &ldquo;so what does this actually cost?&rdquo; anxiety that kills
            deals in the discovery stage. Clients in Brunei respond well to structured offers
            because it feels safe and professional.
          </p>
        </Expandable>

        <Expandable num="3.2" title="Raise rates on a trigger, not a feeling">
          <p>
            &ldquo;Raise rates as proof accumulates&rdquo; is useless advice because it never says
            when or to what. So here is the concrete rule. <strong>The trigger to exit intro pricing
            is 3 published pieces + 2 written testimonials.</strong> The day you hit it, your very
            next quote goes out at your full standard rate — Brand Identity from{" "}
            <strong>BND 2,800</strong> (see the Pricing section) — and never at the intro rate again.
          </p>
          <p>
            After that, raise on a rule, not a mood: <strong>+15–20% after every 3 booked projects</strong>{" "}
            at your current rate, or the moment you&apos;re turning work away. A waitlist is the market
            telling you you&apos;re underpriced — listen to it.
          </p>
          <RateBreakdown
            title="Your rate ladder"
            rows={[
              { label: "Pieces 1–2 · intro partnerships", value: "BND 150–500", note: "buy case studies" },
              { label: "Trigger: 3 published + 2 testimonials", value: "exit intro", kind: "subtotal" },
              { label: "Standard · Brand Identity", value: "BND 2,800+" },
              { label: "After 3 projects at standard", value: "+15–20%", note: "≈ BND 3,300" },
              { label: "Booking 1+/month consistently", value: "Premium + retainer-first", kind: "total" },
            ]}
          />
          <p>
            <strong>Goal by end of Phase 3:</strong> Predictable pipeline, 3–5 retainer clients, a
            referral system that brings new leads passively without you actively hunting.
          </p>
        </Expandable>

        </PhaseGate>

        <WhenThisGoesWrong
          intro="The roadmap looks linear on paper. In practice, Phase 1 is where most solo founders stall. Here's what that actually looks like — and how to keep moving."
          items={[
            {
              scenario: "You've done spec work for weeks and nobody has replied to your DMs.",
              fix: (
                <>
                  This is normal, not failure. Spec work&apos;s primary value is the{" "}
                  <strong>portfolio piece</strong> — the DM is a bonus shot. Keep the pieces, widen
                  the net, and don&apos;t let silence from 3 businesses convince you the strategy is
                  broken. Ship 5 pieces before judging response rates.
                </>
              ),
            },
            {
              scenario: "You're stuck polishing one piece for a month instead of shipping three.",
              fix: (
                <>
                  Perfectionism is procrastination in a nicer outfit. A complete, good piece beats a
                  perfect, unfinished one. Cap each spec project at a fixed time box and{" "}
                  <strong>ship it</strong> — the portfolio counter on your dashboard rewards finished,
                  not flawless.
                </>
              ),
            },
            {
              scenario: "Three months in and you still have zero paying clients.",
              fix: (
                <>
                  Audit the funnel, not your worth. If DMs are high but replies are low, the
                  observation isn&apos;t specific enough. If replies are high but calls are low,
                  you&apos;re not asking. The funnel tracker tells you{" "}
                  <strong>which step is leaking</strong> — fix that one step.
                </>
              ),
            },
          ]}
        />

        <SectionLabel>Phase 1 action checklist</SectionLabel>
        <Checklist panelId="roadmap" tasks={PANEL_TASKS.roadmap} />
      </div>
      <SectionTracker panelId="roadmap" />
    </>
  );
}
