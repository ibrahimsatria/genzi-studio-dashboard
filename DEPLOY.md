# Deploying Genzi Studio Growth OS

This is a Next.js 15 app backed by Supabase Auth + Postgres, designed to deploy to Vercel.

---

## 1. Local development

```bash
npm install
npm run dev               # http://localhost:3000 (or 3001 if 3000 is busy)
# or:
node serve.mjs            # equivalent wrapper
```

Required env vars in `.env.local` (already created):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Optional dev flag

`GENZI_BYPASS_AUTH=1 npm run dev` skips the auth gate on `/dashboard` so you can QA the UI without signing in. **This flag is ignored in production builds** (`NODE_ENV=production`).

---

## 2. Supabase configuration

### 2a. Schema (one-time)

Open Supabase Dashboard → **SQL Editor** → New query → paste the contents of
`supabase/migrations/0001_user_progress.sql` and run. This creates:

- `public.user_progress` table (one row per user, holds XP + task state)
- RLS policies (each user only sees their own row)
- Auto-insert trigger (creates the row on signup)

The script is idempotent — safe to re-run.

### 2b. Auth URL Configuration

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://<your-vercel-domain>.vercel.app` (and `http://localhost:3000` for dev)
- **Additional Redirect URLs:** include
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3001/auth/callback`
  - `https://<your-vercel-domain>.vercel.app/auth/callback`

### 2c. Email confirmation (recommended for dev)

Supabase Dashboard → **Authentication → Providers → Email** → toggle
**"Confirm email"** OFF for fastest local testing. You can re-enable before
shipping if you want users to verify their email.

---

## 3. Deploy to Vercel

### 3a. Connect the GitHub repo

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to `ibrahimsatria/genzi-studio-dashboard`
3. Vercel auto-detects Next.js — no config needed
4. **Environment Variables** — add these two:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://wgxmslageaikzmwbjvpc.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
5. Click **Deploy**

### 3b. After first deploy

1. Note your Vercel domain (e.g. `genzi-studio-dashboard.vercel.app`)
2. Add it to Supabase **Site URL** and **Additional Redirect URLs** (Section 2b)
3. (Optional) Add a custom domain in Vercel → Project → Domains

Subsequent pushes to `main` auto-deploy.

---

## 4. Tooling

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production server (after build) |
| `npm run lint` | ESLint |
| `node screenshot.mjs <url> [label] [viewport]` | Puppeteer screenshot to `./temporary screenshots/` |
| `node scripts/create-test-user.mjs <email> <password>` | Sign up a test user via Supabase REST |

Viewports for `screenshot.mjs`: `mobile`, `tablet`, `desktop`, or custom `WIDTHxHEIGHT`.

---

## 5. Architecture

```
app/
├── (auth)/                  Auth UI (route group, no /auth prefix)
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
├── auth/                    Auth API (cookie exchange + sign-out)
│   ├── callback/route.ts
│   └── sign-out/route.ts
├── dashboard/               Protected by proxy.ts
│   ├── layout.tsx           Shell — sidebar, providers, level-up overlay, canvas bg
│   ├── page.tsx             Overview
│   ├── roadmap/page.tsx
│   ├── portfolio/page.tsx
│   ├── pricing/page.tsx
│   ├── specwork/page.tsx
│   ├── personalbrand/page.tsx
│   └── outreach/page.tsx
├── globals.css              Brand tokens + Tailwind v4 theme
├── layout.tsx               Root — fonts, html shell
└── page.tsx                 Public landing

components/
├── shell/                   App shell (Sidebar, BgCanvas, Effects, Toast, LevelUpOverlay)
├── panel/                   Panel primitives (Card, Quote, Expandable, Checklist, etc.)
├── sign-in-form.tsx
└── sign-up-form.tsx

content/
└── panels.ts                Panel registry (sidebar + routes + metadata)

lib/
├── audio.ts                 Web Audio engine (synthesized tones)
├── progress-types.ts        Progress shape
├── progress-server.ts       Supabase RPCs (server actions)
├── progress-store.tsx       Client store with optimistic updates
├── supabase/                Supabase SSR clients
│   ├── client.ts            Browser
│   ├── server.ts            Server components / route handlers
│   └── proxy.ts             Proxy/middleware session refresh + redirects
└── xp.ts                    Level thresholds, helpers

proxy.ts                     Next.js 16 proxy (renamed from middleware)
supabase/migrations/         SQL to set up DB
```

---

## 6. What lives where (data flow)

- **Strategy content** — inline JSX in `app/dashboard/<panel>/page.tsx`. To edit a panel's copy, open that file. To add a new panel, add an entry to `content/panels.ts` and create a new page file.
- **Per-user state** — `public.user_progress` row in Supabase, mirrored in a client React store. Mutations write to both (optimistically client-side, then server-side).
- **Audio + animations** — pure client (`lib/audio.ts`, `components/shell/Effects.tsx`).
