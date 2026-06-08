# CLAUDE.md — Genzi Studio Growth OS
> Permanent context. Read on every session initialization. Do not modify without explicit instruction.

---

## 1. Project Identity

**Project:** Genzi Studio Growth OS — an interactive, gamified agency growth dashboard, deployed as a multi-user web app
**Owner:** Ibrahim (Genzi Studio, Bandar Seri Begawan, Brunei Darussalam)
**Purpose:** A web-based dashboard consolidating all agency growth strategy (roadmap, portfolio building, pricing, spec work, personal brand, outreach) with XP gamification, sound effects, and animated rewards. Accessible from any device, with per-user progress synced via Supabase.

---

## 2. Tech Stack (post-migration, June 2026)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | TypeScript, Turbopack, no `src/` dir |
| Styling | Tailwind CSS v4 | Custom theme tokens via `@theme` in `app/globals.css`; no default Tailwind palette |
| Auth + DB | Supabase | `@supabase/ssr` for SSR-safe clients; open signup (multi-user); RLS on all user tables |
| Fonts | `next/font/google` | Fraunces · JetBrains Mono · Inter Tight |
| Audio | Web Audio API | `AudioContext` — no external audio libraries |
| Animation | CSS keyframes + Canvas API | Background particle canvas; DOM-injected burst particles |
| Hosting | Vercel | GitHub-connected, auto-deploy on push to main |
| Reference | `genzi-dashboard.html` (root) | Original single-file prototype kept as design reference. Do not delete. |

---

## 3. Design System — FROZEN VALUES

```css
--bg:          #0a0908   /* near-black warm base */
--bg2:         #13110f
--bg3:         #1c1916
--bg4:         #26231e
--brass:       #d4a574   /* primary accent */
--brass-dim:   #a07a50
--sienna:      #c45a3a   /* secondary accent */
--cream:       #f0ead8   /* primary text */
--cream-mid:   #c8bfaa   /* body text */
--cream-dim:   #8a8070   /* muted text */
--green:       #5aaa72   /* success / completed */
--border:      #2a2620
--border-light:#3a3428
```

**Typography:**
- Display / headings: `Fraunces` (serif, weight 300–700, italic for em accents)
- Body / UI: `Inter Tight` (weight 300–600)
- Mono / labels / XP: `JetBrains Mono` (weight 400–600)

---

## 4. File Delivery & Build

- **Output is a deployed Next.js app**, not a single HTML file
- Run dev: `npm run dev` (Turbopack on localhost:3000)
- Build: `npm run build`
- Start prod: `npm run start`
- Deploy: push to GitHub `main` → Vercel auto-deploys
- The original `genzi-dashboard.html` is preserved at the project root as a design and content reference. Do not delete.

---

## 5. Environment Variables

Required in `.env.local` (and configured in Vercel):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

Never commit `.env.local` — `.gitignore` excludes it by default.

---

## 6. Gamification Architecture

| Component | Implementation |
|---|---|
| XP system | 5 levels: Founder → Strategist → Builder → Authority → Agency Owner |
| Level thresholds | 0 / 200 / 450 / 750 / 1100 |
| Section unlock | +50 XP per section, tracked in `user_progress.sections_read` (text[]) |
| Task completion | Per-checklist XP (10–20 XP), tracked in `user_progress.checked_tasks` (text[]) |
| Section "done" trigger | User scrolls to bottom of panel content (not on nav click) |
| Sound engine | Web Audio API `AudioContext` — `playCheck()`, `playSection()`, `playLevelUp()`, `playNav()` |
| Particle burst | DOM-injected particle elements at click coordinates |
| XP float | DOM-injected `+N XP` / `−N XP` floats, rises and fades |
| Level-up overlay | Full-screen takeover with dismiss-on-click or Esc |
| Toggle-able tasks | Tasks can be unchecked; XP is refunded; level recomputes silently if it drops |

---

## 7. Anti-Patterns — Never Do

- ❌ Do not use Vue, Angular, or any non-React framework
- ❌ Do not use Bootstrap, Material UI, or any pre-built component library that imposes its own design language
- ❌ Do not split user-specific state into `localStorage` only — Supabase is the source of truth (localStorage is OK as an optimistic cache)
- ❌ Do not change the color palette, typography stack, or design tokens without explicit instruction
- ❌ Do not add external JS library `<script>` tags from a CDN — install via npm
- ❌ Do not use `sendPrompt()` or any chat-injection patterns — this is a standalone product
- ❌ Do not use default Tailwind palette colors (indigo-500, blue-600, etc.) — derive from `--brass`
- ❌ Do not use `transition-all` — animate `transform` and `opacity` only
- ❌ Do not commit `.env.local`, Supabase service role keys, or any secrets

---

## 8. Content Sections (7 panels)

1. `overview` — mission control, overall progress, nav cards
2. `roadmap` — 3-phase timeline (Phase 1: now, Phase 2: month 1–3, Phase 3: month 3+)
3. `portfolio` — 3 sources, strong vs weak case study, deliverables checklist, target sectors
4. `pricing` — 3-tier deal structure (spec / introductory partnership / value swap)
5. `specwork` — 5-stage process (pick target → brief → full scope → case study → DM)
6. `personalbrand` — two-account strategy, 3 content pillars, conversion funnel, weekly rhythm
7. `outreach` — 4 channels, 3 scripts, priority sectors in BSB, weekly checklist

Source content lives in `content/*.ts` files (typed) and is consumed by route components at `app/dashboard/[section]/page.tsx`.

---

## 9. Brunei / Local Context (Always Apply)

- Market: Bandar Seri Begawan (BSB), Brunei Darussalam — small, relationship-driven
- Currency: BND (Brunei Dollar)
- Target clients: Brunei SMEs — F&B, retail, professional services, new businesses
- Agency accounts: `@genzistudio` (agency) and `@ibrahimsatria._` (personal brand)
- Competitive context: Limited local agency competition; consistency alone creates visibility advantage

---

## 10. Frontend Website Rules

### Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

### Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (Turbopack on `http://localhost:3000`). Run it in the background before taking screenshots.
- If the server is already running, do not start a second instance.

### Screenshot Workflow (Mac)
- Puppeteer is installed locally as a devDependency.
- Take screenshots: `node screenshot.mjs http://localhost:3000`
- Screenshots auto-save to `./temporary screenshots/screenshot-N.png` (incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool — Claude can analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"

### Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

### Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette. Derive from `--brass`/`--sienna`/`--cream` defined in section 3.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity (brass or sienna tint).
- **Typography:** Pair Fraunces (display) with Inter Tight (body). Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing (cubic-bezier(.34,1.56,.64,1) or similar).
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply` where appropriate.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

### Hard Rules
- Mobile-first responsive (the original was desktop-only — fix that)
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

## 11. Next.js Version Note

This project uses Next.js 15. APIs, conventions, and file structure may differ from older training data. Before writing Next.js code, consult `node_modules/next/dist/docs/` and heed deprecation notices.
