import {
  PanelHeader,
  SectionLabel,
  Quote,
  Expandable,
  Checklist,
  SectionTracker,
} from "@/components/panel";

const tasks = [
  { text: "Identify your first spec target and confirm it meets the 3 criteria", xp: 20 },
  { text: "Write the full brief (audience, problem, direction, constraints)", xp: 20 },
  { text: "Complete the full scope — logo system, palette, type, 3+ mockups", xp: 20 },
  { text: "Write the one-page case study following problem → strategy → result", xp: 20 },
  { text: "DM the real business and share the work with no strings attached", xp: 20 },
];

export default function SpecWorkPage() {
  return (
    <>
      <PanelHeader id="specwork" />
      <div className="px-6 py-10 sm:px-12 md:px-14 md:py-12">
        <Quote cite="The standard to aim for">
          Spec work done badly looks like fan art. Done well, it looks like a real case study that
          happens to not have a paying client behind it. The brief you write before starting is
          what makes the difference.
        </Quote>

        <SectionLabel>The 5 stages in full</SectionLabel>

        <Expandable num="01" title="Pick the right target business">
          <p>
            Don&apos;t just pick businesses with bad logos. Pick businesses whose problem a future
            paying client could recognise themselves in. The best candidates have an existing
            product or service worth being proud of — you&apos;re showing what they could look like
            if they invested properly in their brand.
          </p>
          <p><strong>The right target has three qualities:</strong></p>
          <p>
            <strong>1. A visible branding problem</strong> — inconsistent social feed, an
            amateurish logo, no visual system at all, mismatched fonts and colours across
            touchpoints.
          </p>
          <p>
            <strong>2. A product or service people actually want</strong> — a failing business
            makes the &ldquo;what could be&rdquo; story hard to tell convincingly. A good business
            with bad branding makes it effortless.
          </p>
          <p>
            <strong>3. Relevance to your target clients</strong> — if you want to serve F&amp;B
            businesses, do F&amp;B spec work. The portfolio should attract the exact type of
            client you want to keep working with.
          </p>
          <p>
            <strong>Avoid:</strong> Businesses that are objectively failing or closing — the
            upgrade story falls flat. Also avoid anything so obscure that no prospective client
            could place it.
          </p>
        </Expandable>

        <Expandable num="02" title="Write a real brief — before opening Figma or Illustrator">
          <p>
            This is the step most people skip, and it&apos;s what separates a portfolio piece from
            a collection of pretty things. Before any design software, write down:
          </p>
          <p>
            <strong>Business overview:</strong> What do they do, who do they serve, what makes them
            genuinely good at what they do?
          </p>
          <p>
            <strong>The branding problem:</strong> What does their current visual identity fail to
            communicate? What first impression does it create, versus the one it should?
          </p>
          <p>
            <strong>Target audience:</strong> Who is the ideal customer for this business? What
            visual language do they respond to? What signals trust vs. distrust to them?
          </p>
          <p>
            <strong>Strategic direction:</strong> What feeling should the new identity create? What
            values need to come through? What aesthetic territory are you working in — and what
            references are you drawing from?
          </p>
          <p>
            <strong>Constraints:</strong> Industry conventions, cultural context specific to
            Brunei, the appropriate budget register (premium vs. approachable vs. playful).
          </p>
          <p>
            This brief becomes part of your case study and is often what most impresses prospective
            clients — because it proves you think strategically before touching any design tool.
          </p>
        </Expandable>

        <Expandable num="03" title="Do the full scope — not just a logo">
          <p>
            A logo alone is not a portfolio piece. Clients buy confidence in a complete system.
            Show them you can deliver it all the way:
          </p>
          <p>
            <strong>Minimum:</strong> Logo + variations · Colour palette · Type pairing · Business
            card mockup · Instagram profile or feed mockup · One social content template
          </p>
          <p>
            <strong>Strong additions:</strong> Signage or packaging mockup · Brand guideline
            one-pager · Before/after social feed comparison · Short video showing the system in use
          </p>
          <p>
            The question a partial portfolio piece leaves in a client&apos;s mind is &ldquo;can
            they actually finish this?&rdquo; A complete system answers it definitively before
            they&apos;ve asked.
          </p>
        </Expandable>

        <Expandable num="04" title="Present as a case study — not a gallery">
          <p>The format that converts prospective clients consistently:</p>
          <p>
            <strong>Opening paragraph:</strong> The business, who they serve, and what their
            branding problem was. Include the before screenshot. Be specific and respectful —
            you&apos;re diagnosing an opportunity, not mocking them.
          </p>
          <p>
            <strong>Strategy paragraph:</strong> What direction you chose and why. What you
            rejected and why. What the new identity needs to communicate. This is where your
            thinking is visible to a prospective client reading the case study.
          </p>
          <p>
            <strong>The work:</strong> Full system presented cleanly. Multiple mockups in
            real-world context. Don&apos;t just show the logo floating on white — show it on a
            business card, on a shopfront, in a social post as it would actually appear.
          </p>
          <p>
            <strong>Closing line:</strong> What would change. Keep it grounded and
            forward-looking: &ldquo;A coherent identity that positions [Business] as the premium
            choice in their category, allowing them to charge accordingly.&rdquo;
          </p>
        </Expandable>

        <Expandable num="05" title="DM the actual business once the piece is done">
          <p>
            This is where spec work becomes doubly valuable. Once the piece is done, message the
            actual business owner. You&apos;ll get one of three outcomes — all of them positive:
          </p>
          <p>
            They love it and want to use it → potential paying client. They&apos;re flattered and
            remember you → warm relationship for when they&apos;re ready. They don&apos;t respond →
            no loss, you still have the portfolio piece to show everyone else.
          </p>
          <Quote>
            &ldquo;Hi [Name] — I work in brand design and recently put together a concept for
            [Business Name] as part of some personal portfolio work. I&apos;d love to share it with
            you if you&apos;re open to seeing it. No strings attached at all — I just think
            there&apos;s a great brand story in what you&apos;ve built and wanted to show you what
            it could look like.&rdquo;
          </Quote>
          <p>
            <strong>Why this lands in Brunei specifically:</strong> The market is small enough that
            a genuine, personal message about a specific business stands out immediately. Most
            owners are used to generic pitches. A message that&apos;s clearly about their business
            — with real creative work already done behind it — is almost impossible not to respond
            to.
          </p>
        </Expandable>

        <SectionLabel>First spec project — your action checklist</SectionLabel>
        <Checklist panelId="specwork" tasks={tasks} />
      </div>
      <SectionTracker panelId="specwork" />
    </>
  );
}
