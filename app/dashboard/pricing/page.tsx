import {
  PanelHeader,
  SectionLabel,
  Quote,
  TierRow,
  Tier,
  Expandable,
  Checklist,
  SectionTracker,
  WhenThisGoesWrong,
} from "@/components/panel";
import { PANEL_TASKS } from "@/content/tasks";

export default function PricingPage() {
  return (
    <>
      <PanelHeader id="pricing" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <Quote cite="The mindset shift that protects your positioning">
          You&apos;re not doing free work. You&apos;re buying an asset — a case study — at a
          negotiated price. That reframe changes every conversation you have about it.
        </Quote>

        <SectionLabel>The 3-tier deal structure</SectionLabel>
        <TierRow>
          <Tier
            badge={{ text: "Tier 1 — Spec", tone: "green" }}
            name="No client needed"
            price="BND 0"
            priceSub="your time only"
            list={[
              "You choose the business",
              "No client approval needed",
              "Full creative control, all rights",
              "No delivery pressure or delays",
            ]}
            note="No testimonial — but you can DM afterwards"
          />
          <Tier
            recommended
            badge={{ text: "Tier 2 — Recommended", tone: "brass" }}
            name="Introductory partnership"
            price="50–70% off"
            priceSub="future rate"
            list={[
              "Real client relationship",
              "Written testimonial at delivery",
              "Full publishing rights in writing",
              "Money exchanged = mutual respect",
            ]}
            note="Cap strictly at 2 clients at this rate"
          />
          <Tier
            badge={{ text: "Tier 3 — Value swap", tone: "sienna" }}
            name="Work for non-cash value"
            price="BND 0"
            priceSub="trade for value"
            list={[
              "Trade design for their service",
              "Builds local network naturally",
              "Feels mutual, not one-sided",
              "Formalize the exchange in writing",
            ]}
            note="Only if the trade genuinely benefits you"
          />
        </TierRow>

        <SectionLabel>Why Tier 2 beats free every time</SectionLabel>

        <Expandable num="→" title="The psychology of charging something — even a small amount">
          <p>
            When a client pays even BND 150–300 for what would normally cost BND 1,000+, they show
            up to feedback calls. They respond to messages within a day. They make creative
            decisions instead of postponing. They respect the timeline. Paying clients treat you
            like a professional because they&apos;ve placed real value on the engagement.
          </p>
          <p>
            Free clients often ghost, delay, become demanding, or pivot the project indefinitely —
            because they feel they have nothing to lose. The cost to them of wasting your time is
            zero.
          </p>
          <p>
            Charging something also changes how you show up. You take the brief more seriously. You
            set a scope. You create a delivery expectation. The whole dynamic becomes professional
            on both sides, which ultimately means better work and a better case study.
          </p>
        </Expandable>

        <Expandable num="→" title="How to frame the introductory rate conversation">
          <Quote>
            &ldquo;I&apos;m selectively taking on a small number of introductory partnerships this
            quarter where I offer a significantly reduced rate in exchange for the ability to use
            the work in my portfolio and a testimonial at the end. I think your business would make
            a compelling case study — would that arrangement interest you?&rdquo;
          </Quote>
          <p>
            Notice the structure: <strong>&ldquo;selectively&rdquo;</strong> signals demand and
            exclusivity. <strong>&ldquo;introductory partnership&rdquo;</strong> is mutual and
            professional rather than charitable.{" "}
            <strong>&ldquo;compelling case study&rdquo;</strong> flatters them while explaining
            your honest motivation. You&apos;re choosing them, not begging them.
          </p>
        </Expandable>

        <SectionLabel>Non-negotiable conditions on every deal</SectionLabel>

        <Expandable num="1" title="Full publishing rights — always confirm in writing first">
          <p>
            Before starting any project at any rate, confirm in writing that you can post the work
            on your website, Instagram, portfolio platforms, and pitches — forever, without
            needing permission each time. A message thread confirmation counts. A signed brief is
            better. Without this, you might do your best work ever and be unable to show it because
            the client got anxious about public visibility later.
          </p>
        </Expandable>

        <Expandable num="2" title="Written testimonial — ask on delivery day at peak happiness">
          <p>
            Ask for the testimonial the moment you deliver the final work — when the excitement is
            highest and they&apos;re seeing the full transformation for the first time. Push gently
            for specificity: &ldquo;How do you think this will change how customers perceive
            you?&rdquo; A quote about results — &ldquo;this makes us look like we&apos;ve been doing
            this for 10 years&rdquo; — is ten times more persuasive than &ldquo;Ibrahim was great
            to work with and very professional.&rdquo;
          </p>
        </Expandable>

        <Expandable num="3" title="Hard expiry on the discount — say it clearly before starting">
          <Quote>
            &ldquo;Just so we&apos;re aligned — this rate is specific to this first project. If we
            work together again, or if you refer someone to me, it would be at my standard rate.
            Happy to share that now so there&apos;s no surprise later.&rdquo;
          </Quote>
          <p>
            Most good clients respect this completely. The ones who push back are exactly who you
            want to filter out early. This also subtly signals that you expect the work to be good
            enough to justify working together again — which creates a quiet confidence that&apos;s
            hard to replicate any other way.
          </p>
        </Expandable>

        <Expandable num="4" title="You lead creative direction — cap revisions at two rounds">
          <p>
            Cap revisions at two rounds from the beginning: &ldquo;I&apos;ll present three strong
            directions at the start, then we refine together — I find two rounds of revisions is
            usually plenty to get to something we&apos;re both genuinely proud of.&rdquo; This is a
            portfolio piece. If the client overrides every decision, the final work won&apos;t
            reflect your ability or aesthetic — which defeats the entire purpose of the
            arrangement. Two rounds also creates natural urgency and prevents projects from
            becoming endless.
          </p>
        </Expandable>

        <WhenThisGoesWrong
          intro="Discounted work is the single most dangerous part of this whole strategy — not because of the discount, but because of what happens when boundaries slip. Here's how it goes wrong and how to hold the line."
          items={[
            {
              scenario: "Your discounted client keeps demanding 'just one more' revision round.",
              fix: (
                <>
                  This is why the two-round cap is set <strong>in writing at kickoff</strong>, not
                  improvised later. When they ask for round three: &ldquo;Happy to — revisions beyond
                  the two we agreed are billed at my standard hourly rate. Want me to send a quick
                  estimate?&rdquo; Most stop immediately. The ones who don&apos;t are now paying you
                  properly. Either outcome is fine.
                </>
              ),
            },
            {
              scenario: "You realize every client expects your discounted rate to be your real rate.",
              fix: (
                <>
                  This is the permanent-discount trap, and it&apos;s how solo studios quietly die.
                  The defense is the <strong>hard expiry</strong>: state, in writing, that the rate is
                  specific to the first project before you start. Cap introductory deals at 2,
                  total — not 2 at a time. Once you&apos;ve shipped them, your published work and
                  testimonials justify full price. Raise it and don&apos;t apologize.
                </>
              ),
            },
            {
              scenario: "A 'free' value-swap has eaten 20 hours and you've gotten nothing usable back.",
              fix: (
                <>
                  Value swaps only work when the trade is <strong>concrete and bounded</strong> before
                  you start — defined deliverable, defined return, defined deadline, in writing. If
                  the other side&apos;s value is vague (&ldquo;exposure,&rdquo; &ldquo;future
                  work&rdquo;), it&apos;s not a swap, it&apos;s free work with extra steps. Walk away
                  and put those 20 hours into a spec piece you fully own.
                </>
              ),
            },
          ]}
        />

        <SectionLabel>Pre-project checklist</SectionLabel>
        <Checklist panelId="pricing" tasks={PANEL_TASKS.pricing} />
      </div>
      <SectionTracker panelId="pricing" />
    </>
  );
}
