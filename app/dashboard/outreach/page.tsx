import {
  PanelHeader,
  SectionLabel,
  Body,
  Quote,
  Grid,
  Card,
  Expandable,
  Checklist,
  SectionTracker,
  WhenThisGoesWrong,
} from "@/components/panel";
import { OutreachLog } from "@/components/metrics";
import { PANEL_TASKS } from "@/content/tasks";

export default function OutreachPage() {
  return (
    <>
      <PanelHeader id="outreach" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <Quote cite="The mindset that opens doors in a small, relationship-driven market">
          Cold pitches don&apos;t work in Brunei. Specific observations do. The difference between
          the two is whether the business owner feels seen — or marketed to.
        </Quote>

        <SectionLabel>Your outreach log — track every prospect</SectionLabel>
        <Body>
          This is the log this section keeps telling you to set up. Add a prospect the moment you
          send a DM, then advance it through the stages as the conversation moves. The pipeline
          funnel on your dashboard reads straight from here — so logging a DM updates your funnel
          automatically.
        </Body>
        <OutreachLog />

        <SectionLabel>The 4 outreach channels — ranked by signal</SectionLabel>
        <Grid cols={2}>
          <Card
            eyebrow="Channel 1 · Highest signal"
            title="Instagram DM after spec work"
            body="You did the work first. Message them with the finished concept attached. This is the single highest-converting outreach format you have access to — because it's impossible to read as a generic pitch."
            tag="Use for: businesses you've already designed for"
          />
          <Card
            eyebrow="Channel 2 · High signal"
            title="Warm intro via mutual contact"
            body="A friend, former colleague, or someone you've worked with introduces you. The introduction does the trust-building work upfront. In BSB this is the most natural way clients flow — leverage your network deliberately, not passively."
            tag="Use for: target businesses one degree away"
          />
          <Card
            eyebrow="Channel 3 · Medium signal"
            title="Specific-observation DM"
            body="Cold DM, but lead with a real observation about their business — not a service pitch. The bar is high: if your observation could apply to any business in the same category, it's not specific enough yet. Rewrite until it couldn't."
            tag="Use for: businesses where spec is not yet feasible"
          />
          <Card
            eyebrow="Channel 4 · Slow-burn signal"
            title="LinkedIn presence + events"
            body="Doesn't book clients today. Builds visibility so that when you DM, or when they need a designer, you're already a familiar name. Post weekly. Show up at Chamber of Commerce events, BEDB sessions, youth entrepreneurship meetups."
            tag="Use for: long-term positioning"
          />
        </Grid>

        <SectionLabel>3 outreach scripts you can use this week</SectionLabel>

        <Expandable num="01" title="Script — Spec work delivery (Channel 1)">
          <Quote>
            &ldquo;Hi [Name] — I work in brand design and recently put together a concept for
            [Business Name] as part of some personal portfolio work. No strings attached — I just
            thought there was a great brand story in what you&apos;ve built, and I wanted to show
            you what it could look like. Happy to share the file if you&apos;re open to it.&rdquo;
          </Quote>
          <p>
            <strong>Why it works:</strong> You&apos;re not asking for anything. You&apos;re
            offering something. The phrase &ldquo;no strings attached&rdquo; disarms the natural
            defensive reaction owners have to anyone DMing about their business. You&apos;ve
            already done the work, so they don&apos;t have to imagine — they just have to look.
          </p>
          <p>
            <strong>Follow-up if no reply in 5 days:</strong> &ldquo;Hey — totally understand if
            it&apos;s not the right time. Wanted to send the file over anyway in case it&apos;s
            useful down the line. Take care.&rdquo; Then send it. Send the file regardless.
            That&apos;s the move that surprises them.
          </p>
        </Expandable>

        <Expandable num="02" title="Script — Warm intro request (Channel 2)">
          <Quote>
            &ldquo;Hey [Mutual Contact] — quick favour. I&apos;m growing my brand design studio
            (Genzi Studio) and I think [Target Business] could really benefit from a brand refresh.
            I know you work with / know [Owner Name] — would you be open to a quick introduction?
            Happy to share my portfolio first so you can decide if it makes sense.&rdquo;
          </Quote>
          <p>
            <strong>Why it works:</strong> You give them an easy out (&ldquo;if it makes
            sense&rdquo;). You share proof upfront so they&apos;re not vouching blind. You make
            the ask small and specific — an intro, not an endorsement. In Brunei, people are
            willing to make introductions; they just need to feel safe doing it.
          </p>
          <p>
            <strong>What to send them:</strong> Your portfolio link, 1–2 lines on why this target
            business specifically, and a screenshot of one piece of relevant work. Three things,
            no more. Make it copy-pasteable so they can forward it directly to the owner without
            rewriting anything.
          </p>
        </Expandable>

        <Expandable num="03" title="Script — Specific-observation cold DM (Channel 3)">
          <Quote>
            &ldquo;Hi [Name] — I came across [Business] recently and noticed your Instagram
            hasn&apos;t been updated in about 3 months. I had a few specific ideas for how the
            visual identity could work harder for you. Open to a quick 20-minute conversation? No
            pitch — just a chat.&rdquo;
          </Quote>
          <p>
            <strong>Why it works:</strong> The specific observation (&ldquo;3 months&rdquo;) signals
            you actually looked. The phrase &ldquo;no pitch — just a chat&rdquo; disarms
            expectation of being sold to. The time-boxed ask (&ldquo;20 minutes&rdquo;) is small
            enough to say yes to without anxiety.
          </p>
          <p>
            <strong>What to avoid:</strong> Anything that could apply to any other business.
            &ldquo;I love what you&apos;re doing&rdquo; is dead on arrival. &ldquo;Your logo could
            be stronger&rdquo; is too prescriptive. The sweet spot is specific + neutral + curious
            — a doctor&apos;s observation, not a salesperson&apos;s pitch.
          </p>
        </Expandable>

        <SectionLabel>Priority target sectors in BSB right now</SectionLabel>
        <Grid cols={2}>
          <Card
            eyebrow="Sector 1"
            title="Cafés, kopitiams, dessert spots"
            body="Visible to walk-by traffic, social-media-dependent, and almost universally underbranded. The owner is usually the operator — meaning you can DM them directly, not a marketing department. High close rate when the observation is sharp."
            tag="Best DM channel: Instagram"
          />
          <Card
            eyebrow="Sector 2"
            title="Professional services"
            body="Accounting firms, legal practices, clinics, consultancies. Real budgets, branding directly affects perceived trust and pricing power. Slower to close than F&B, but each deal is worth 3–5x. Best approached via warm intro or LinkedIn."
            tag="Best DM channel: LinkedIn or warm intro"
          />
          <Card
            eyebrow="Sector 3"
            title="Retail & lifestyle brands"
            body="Boutiques, salons, fitness studios, wellness brands. Aesthetic-driven sectors where great branding is a direct competitive moat. Owners typically care about visual quality intrinsically — easy conversations once the door opens."
            tag="Best DM channel: Instagram"
          />
          <Card
            eyebrow="Sector 4"
            title="New businesses launching"
            body="Anyone within the first 6 months of launch. They have no brand baggage, decision-making is fast, and they often have a small launch budget specifically earmarked for identity. Watch local launch announcements weekly."
            tag="Best DM channel: any — be fastest"
          />
        </Grid>

        <SectionLabel>The weekly outreach rhythm</SectionLabel>
        <Body>
          Outreach is a numbers game until it becomes a referral game. The first 90 days are about
          volume in the right direction — specific, considered messages sent consistently to the
          right sectors. Set a target you can actually hit every week without burning out, and
          protect that time on your calendar like a client meeting.
        </Body>
        <Grid cols={3}>
          <Card
            eyebrow="Monday"
            title="Research & pick targets"
            body="Identify 5 specific businesses you'll reach out to this week. Look at their current branding, social activity, customer base. Take notes that will become your specific observation."
          />
          <Card
            eyebrow="Tuesday – Thursday"
            title="Send the messages"
            body="Send personalised DMs across the 5 targets — spread out, not all at once. Don't bulk-send templated messages. Quality of message beats quantity of outreach in this market every single time."
          />
          <Card
            eyebrow="Friday"
            title="Follow up & log results"
            body="Follow up on anyone who hasn't replied after 5 days. Log responses in a simple sheet: target, channel, message sent, response, next action. Patterns emerge after 4 weeks that change your approach."
          />
        </Grid>

        <WhenThisGoesWrong
          intro="Outreach is where rejection lives, so it's where people quietly give up. Here's how the common failures actually read — and what to do instead."
          items={[
            {
              scenario: "You sent 30 DMs and got two replies, and you're ready to quit.",
              fix: (
                <>
                  A 2-of-30 reply rate isn&apos;t failure — for cold outreach it&apos;s roughly
                  normal, and it&apos;s <strong>fixable at one specific step</strong>. Check the
                  funnel: low replies almost always means the observation isn&apos;t specific enough.
                  Rewrite until your opener couldn&apos;t be sent to any other business in the
                  category, then measure again.
                </>
              ),
            },
            {
              scenario: "You're tempted to copy-paste the same message to 50 businesses to save time.",
              fix: (
                <>
                  In a market as small as BSB this <strong>backfires</strong> — owners talk, and a
                  templated DM that lands twice marks you as a spammer permanently. Five genuinely
                  specific messages beat fifty generic ones here every single time. Protect quality
                  over volume; the relationship-driven market punishes shortcuts.
                </>
              ),
            },
            {
              scenario: "Someone replied with interest a week ago and the thread just... died.",
              fix: (
                <>
                  Warm leads go cold without a system, not without interest. The outreach log above
                  exists so nobody falls through — <strong>advance every replied prospect</strong>
                  and follow up within a few days. &ldquo;Hey, still happy to share those ideas
                  whenever suits — no rush&rdquo; revives more threads than you&apos;d expect.
                </>
              ),
            },
          ]}
        />

        <SectionLabel>Outreach action checklist</SectionLabel>
        <Checklist panelId="outreach" tasks={PANEL_TASKS.outreach} />
      </div>
      <SectionTracker panelId="outreach" />
    </>
  );
}
