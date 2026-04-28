# GoalPool.app

Premium bracket-first sports prediction platform built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, Framer Motion, and Supabase.

GoalPool uses neutral tournament language and country flags. It does not use FIFA branding, FIFA logos, or official World Cup marks.

## MVP Routes

- `/` landing page
- `/bracket` interactive demo bracket and pick winners screen
- `/create` create bracket flow
- `/dashboard` saved brackets dashboard
- `/b/[share_slug]` public shared bracket view
- `/pools/[invite_code]` pool leaderboard and join screen
- `/admin/seed` seed data preview

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://goalpool.app
```

The current MVP can run as a polished local demo without Supabase credentials. Supabase clients are lazily initialized so missing env vars do not break the build.

## Supabase

Run the schema migration:

```bash
supabase db push
```

Or paste `supabase/migrations/001_goalpool_schema.sql` into the Supabase SQL editor.

Seed demo data:

```bash
supabase db reset
```

Or paste `supabase/seed.sql` into the SQL editor after the migration. The seed creates a neutral 48-team Global Football Tournament, group labels A-L, knockout placeholders, and default scoring.

## Vercel Deployment Notes

1. Create a Vercel project from this repo.
2. Set the four environment variables above in Vercel Project Settings.
3. Use the default build command: `npm run build`.
4. Use the default output for Next.js. Vercel auto-detects App Router.
5. Apply Supabase migrations before sending real users to the app.

## Product Notes

- Bracket picks auto-advance winners.
- Changing an earlier pick resets affected downstream picks.
- Mobile bracket scrolls horizontally with sticky round labels.
- Public shared brackets are read-only.
- Default scoring: 1, 2, 4, 8, 16, 32 by round.
