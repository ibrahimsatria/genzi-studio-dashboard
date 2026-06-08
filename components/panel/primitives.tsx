import { type ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 mb-5 border-b border-border-base pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-brass-dim first:mt-0">
      {children}
    </h2>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[15px] leading-[1.8] text-cream-mid last:mb-0">
      {children}
    </p>
  );
}

export function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure
      className="my-5 rounded-r-xl border-l-2 border-brass px-5 py-4"
      style={{
        background:
          "linear-gradient(90deg, rgba(212,165,116,.06), transparent)",
      }}
    >
      <blockquote className="font-display text-[16px] italic leading-[1.65] text-cream">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mt-2.5 font-mono text-[10px] tracking-wide text-brass-dim">
          — {cite}
        </figcaption>
      )}
    </figure>
  );
}

export function Grid({
  cols,
  children,
}: {
  cols: 2 | 3;
  children: ReactNode;
}) {
  const cls =
    cols === 3
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-5"
      : "grid grid-cols-1 gap-4 md:grid-cols-2 mb-5";
  return <div className={cls}>{children}</div>;
}

export function Card({
  eyebrow,
  title,
  body,
  tag,
}: {
  eyebrow?: string;
  title: string;
  body: ReactNode;
  tag?: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border-base bg-bg-2 p-6 transition-[transform,border-color] duration-200 ease-spring hover:-translate-y-[3px] hover:border-border-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,165,116,.18), transparent)",
        }}
      />
      {eyebrow && (
        <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-brass-dim">
          {eyebrow}
        </div>
      )}
      <h3 className="mb-2.5 text-base font-medium leading-tight text-cream">
        {title}
      </h3>
      <div className="text-[13px] leading-[1.7] text-cream-mid">{body}</div>
      {tag && (
        <div className="mt-3.5 font-mono text-[10px] text-sienna">{tag}</div>
      )}
    </article>
  );
}

// ─── Pricing tiers ───────────────────────────────────────────────────────
export function TierRow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">{children}</div>
  );
}

type TierProps = {
  recommended?: boolean;
  badge: { text: string; tone: "green" | "brass" | "sienna" };
  name: string;
  price: string;
  priceSub?: string;
  list: string[];
  note?: string;
};

export function Tier({ recommended, badge, name, price, priceSub, list, note }: TierProps) {
  const badgeCls = {
    green: "bg-green/15 text-green border-green/25",
    brass: "bg-brass/15 text-brass border-brass/25",
    sienna: "bg-sienna/15 text-sienna border-sienna/25",
  }[badge.tone];
  return (
    <article
      className={[
        "rounded-xl border bg-bg-2 p-6 transition-colors duration-200",
        recommended
          ? "border-brass/35"
          : "border-border-base hover:border-border-soft",
      ].join(" ")}
      style={
        recommended
          ? {
              background:
                "linear-gradient(135deg, rgba(212,165,116,.06), transparent)",
            }
          : undefined
      }
    >
      <span
        className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${badgeCls}`}
      >
        {badge.text}
      </span>
      <h3 className="mt-3 text-base font-medium text-cream">{name}</h3>
      <div className="mt-1 font-display text-[26px] leading-none text-brass">
        {price}{" "}
        {priceSub && (
          <small className="font-sans text-[12px] font-normal text-cream-dim">
            {priceSub}
          </small>
        )}
      </div>
      <ul className="mt-4 space-y-1.5 text-[13px] leading-[1.9] text-cream-mid">
        {list.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-1 shrink-0 text-brass-dim">
              →
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      {note && (
        <div className="mt-3 font-mono text-[11px] text-sienna">{note}</div>
      )}
    </article>
  );
}

// ─── Pillar (Personal Brand) ─────────────────────────────────────────────
export function Pillar({
  num,
  title,
  body,
  example,
}: {
  num: string;
  title: string;
  body: string;
  example?: string;
}) {
  return (
    <article className="rounded-xl border border-border-base bg-bg-2 p-6 transition-[transform,border-color] duration-200 ease-spring hover:-translate-y-[3px] hover:border-border-soft">
      <div className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-brass-dim">
        {num}
      </div>
      <h3 className="mb-2.5 text-base font-medium text-cream">{title}</h3>
      <p className="mb-3.5 text-[13px] leading-[1.7] text-cream-mid">{body}</p>
      {example && (
        <p className="rounded-r-md border-l-2 border-brass-dim bg-bg-4 px-3.5 py-3 text-[12px] italic leading-[1.6] text-cream-mid">
          {example}
        </p>
      )}
    </article>
  );
}

// ─── Phase Row (Roadmap) ─────────────────────────────────────────────────
export type Phase = {
  n: number;
  span: string;
  name: string;
  time: string;
  state: "now" | "next" | "scale";
};

export function PhaseRow({ phases }: { phases: Phase[] }) {
  return (
    <div className="relative mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        aria-hidden
        className="absolute left-[16%] right-[16%] top-9 hidden h-px opacity-40 sm:block"
        style={{
          background:
            "linear-gradient(90deg, var(--brass-dim), var(--border-light))",
        }}
      />
      {phases.map((p) => {
        const active = p.state === "now";
        return (
          <div key={p.n} className="relative text-center px-2.5">
            <div
              className={[
                "mx-auto mb-3.5 grid h-[72px] w-[72px] place-items-center rounded-full border font-display text-[22px] font-light transition-all duration-300",
                active
                  ? "border-green/40 bg-green/15 text-green shadow-[0_0_24px_rgba(90,170,114,.15)]"
                  : "border-border-soft bg-bg-3 text-cream-dim",
              ].join(" ")}
            >
              {p.n}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-cream-dim">
              {p.span}
            </div>
            <div className="mt-1 text-[15px] font-medium text-cream">{p.name}</div>
            <div className="mt-0.5 font-mono text-[11px] text-brass-dim">{p.time}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hero block (Overview) ───────────────────────────────────────────────
export function HeroBlock({
  title,
  titleEm,
  body,
}: {
  title: string;
  titleEm: string;
  body: string;
}) {
  return (
    <section
      className="relative mb-7 overflow-hidden rounded-2xl border border-border-base p-8 sm:p-10"
      style={{
        background:
          "linear-gradient(135deg, var(--bg2), var(--bg3))",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-3 select-none font-display text-[130px] font-bold leading-none text-brass/[0.04]"
      >
        GENZI
      </div>
      <h2 className="font-display text-[clamp(1.6rem,4vw,1.85rem)] font-light leading-[1.2] text-cream">
        {title}{" "}
        <em className="font-light italic text-brass">{titleEm}</em>
      </h2>
      <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-cream-mid">
        {body}
      </p>
    </section>
  );
}
