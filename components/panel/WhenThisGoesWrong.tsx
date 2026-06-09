import { type ReactNode } from "react";

export type RiskItem = { scenario: string; fix: ReactNode };

// Reality-check block (Priority 5). Sienna-accented so it reads as a caution
// distinct from the normal brass instructional surfaces.
export function WhenThisGoesWrong({
  items,
  intro,
}: {
  items: RiskItem[];
  intro?: string;
}) {
  return (
    <section
      className="my-6 overflow-hidden rounded-xl border border-sienna/25 p-6"
      style={{
        background: "linear-gradient(135deg, rgba(196,90,58,.06), transparent 60%)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-full border border-sienna/40 bg-sienna/10 text-[12px] text-sienna"
        >
          !
        </span>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-sienna">
          When this goes wrong
        </h3>
      </div>

      {intro && (
        <p className="mt-3 text-[14px] leading-[1.75] text-cream-mid">{intro}</p>
      )}

      <ul className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="border-l-2 border-sienna/30 pl-4">
            <div className="text-[14px] font-medium leading-snug text-cream">
              {item.scenario}
            </div>
            <div className="mt-1.5 text-[13px] leading-[1.7] text-cream-mid [&_strong]:font-semibold [&_strong]:text-cream">
              {item.fix}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
