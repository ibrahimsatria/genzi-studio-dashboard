import {
  PanelHeader,
  SectionLabel,
  Body,
  Quote,
  Grid,
  Card,
  Pillar,
  Expandable,
  Checklist,
  SectionTracker,
  WhenThisGoesWrong,
} from "@/components/panel";
import { PANEL_TASKS } from "@/content/tasks";

export default function PersonalBrandPage() {
  return (
    <>
      <PanelHeader id="personalbrand" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <Quote cite="Why both accounts need to be active and distinct">
          In Brunei&apos;s relationship-driven market, clients hire people they feel they
          understand. The personal brand builds that understanding before a business conversation
          ever happens.
        </Quote>

        <SectionLabel>Two accounts, two different jobs</SectionLabel>
        <Grid cols={2}>
          <Card
            eyebrow="ibrahimsatria._"
            title="Trust and perspective"
            body="Show your thinking, your creative point of view, your founder journey, your reads on the local market. People follow people. This is where strangers decide whether they like how your mind works — long before they're ready to hire anyone."
            tag="Top of the funnel — earns attention"
          />
          <Card
            eyebrow="@genzistudio"
            title="Credibility and proof"
            body="Show finished case studies, before/afters, client wins, agency POVs on branding. This is where someone already considering an agency confirms you're the right one. Less personality, more receipts."
            tag="Bottom of the funnel — converts intent"
          />
        </Grid>
        <Body>
          Both bios link to each other. Both feeds get posts each week. The personal account stays
          on, even when the agency feels louder — because the personal account is what makes the
          agency feel human.
        </Body>

        <SectionLabel>The 3 content pillars for ibrahimsatria._</SectionLabel>
        <Grid cols={3}>
          <Pillar
            num="Pillar 01"
            title="Process & craft"
            body="Show how a project moves from blank brief to finished system. Concept sketches. Type explorations. Reasons you rejected option B. This is where you prove you think strategically — not just visually."
            example={`"Three logo directions I explored for [Café]. Why I chose the one I did — and what the rejected ones taught me about the brand."`}
          />
          <Pillar
            num="Pillar 02"
            title="Strategic POV on Brunei"
            body="Sharp, specific opinions on why local SMEs underinvest in brand, what BSB businesses get wrong about Instagram, what good looks like in a market this small. This builds you as a thinker, not just a producer."
            example={`"Most Brunei F&B brands look like they were designed in 2014. Here's what they're losing because of it — and what changing it would actually cost."`}
          />
          <Pillar
            num="Pillar 03"
            title="Founder journey"
            body="The honest behind-the-scenes of building Genzi Studio. Wins, missed pitches, lessons. People back founders they've watched grow. This pillar is what turns followers into referrers a year from now."
            example={`"First six months of Genzi Studio: 0 clients to 3. Here's what worked, what didn't, and what I'd do differently if I started today."`}
          />
        </Grid>

        <SectionLabel>The conversion funnel between your accounts</SectionLabel>

        <Expandable num="→" title="How a stranger becomes a paying client">
          <p>
            <strong>Step 1 — Discovery:</strong> They see your personal content shared by someone
            they trust, or it shows up in their feed because the local creative scene is small and
            the algorithm notices.
          </p>
          <p>
            <strong>Step 2 — Following:</strong> They like one or two posts, scroll your feed,
            decide your perspective is useful enough to follow. They&apos;re not a client yet —
            they&apos;re an audience member.
          </p>
          <p>
            <strong>Step 3 — Cross-over:</strong> A post mentions @genzistudio, or a case study
            lands. They click through. They see proof. They start thinking &ldquo;their work is
            good — and I already trust the person behind it.&rdquo;
          </p>
          <p>
            <strong>Step 4 — Trigger:</strong> Months later, they need a brand. You&apos;re the
            first name that comes to mind. They DM. You haven&apos;t pitched once.
          </p>
          <p>
            This is what consistent personal content buys you. It&apos;s slow at first, then
            suddenly compounds — because every post adds to the asset, and the local market is
            small enough that consistency alone creates dominance.
          </p>
        </Expandable>

        <Expandable num="→" title="The bio + link strategy that ties both accounts together">
          <p>
            <strong>ibrahimsatria._ bio:</strong> One line on what you do, one line on who you
            serve, link to @genzistudio. Something like: &ldquo;Brand designer building Genzi Studio
            in Brunei. Notes on craft, strategy, and growing an agency from zero. →
            @genzistudio&rdquo;
          </p>
          <p>
            <strong>@genzistudio bio:</strong> Agency positioning line, sectors you serve, link
            back to your personal. Something like: &ldquo;Brand &amp; identity studio for
            Brunei&apos;s next generation of businesses. Founded by @ibrahimsatria._ · DM to start
            a conversation.&rdquo;
          </p>
          <p>
            Both bios should feel like two sides of the same brand, not two separate identities. A
            stranger should land on either one and immediately understand the relationship between
            them.
          </p>
        </Expandable>

        <SectionLabel>Weekly content rhythm — sustainable, not heroic</SectionLabel>
        <Body>
          Aim for consistency, not volume. The single biggest mistake new creators make is posting
          daily for two weeks and then disappearing for two months. That pattern actively damages
          trust. A predictable, slower rhythm beats a chaotic faster one every time.
        </Body>
        <Grid cols={3}>
          <Card
            eyebrow="Monday"
            title="Process post"
            body="A behind-the-scenes shot from current work — a concept exploration, a colour study, a rejected direction with why it didn't fit. Pillar 01."
          />
          <Card
            eyebrow="Wednesday"
            title="Perspective post"
            body="A specific opinion on something happening in the local market. A take on a brand you walked past. Pillar 02. This is your highest-leverage content type."
          />
          <Card
            eyebrow="Friday"
            title="Story or founder note"
            body="A reflection, a lesson learned this week, an honest update on the agency journey. Pillar 03. Lower polish, higher humanity."
          />
        </Grid>

        <WhenThisGoesWrong
          intro="A personal brand fails quietly — not in a dramatic flop, but in a slow fade. These are the patterns to catch early."
          items={[
            {
              scenario: "You posted hard for two weeks, then went silent for a month.",
              fix: (
                <>
                  This bursting-then-vanishing pattern actively <strong>damages</strong> trust — it
                  signals you don&apos;t finish things. Drop to a rhythm you can sustain on your worst
                  week: even one good post a week beats five-then-zero. The weekly rhythm tracker on
                  your dashboard exists precisely to protect you from this.
                </>
              ),
            },
            {
              scenario: "You're getting likes and follows but zero business conversations.",
              fix: (
                <>
                  Engagement isn&apos;t the goal — <strong>cross-over</strong> is. If the personal
                  account never points to @genzistudio and never shows the work, followers have no
                  path to becoming clients. Make sure your bio links across and that roughly one in
                  three posts references the agency or a real project.
                </>
              ),
            },
            {
              scenario: "Every post feels like it has to be polished and profound, so you post nothing.",
              fix: (
                <>
                  The founder-journey pillar exists to kill this. <strong>Lower the bar
                  deliberately</strong>: a quick honest note about what you learned this week is
                  higher-trust than a perfectly art-directed carousel. Done and human beats polished
                  and absent.
                </>
              ),
            },
          ]}
        />

        <SectionLabel>Personal brand action checklist</SectionLabel>
        <Checklist panelId="personalbrand" tasks={PANEL_TASKS.personalbrand} />
      </div>
      <SectionTracker panelId="personalbrand" />
    </>
  );
}
