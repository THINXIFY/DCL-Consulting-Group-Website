# DCL Consulting Group Website

Marketing site and API for DCL Consulting and Investments Limited — a pnpm
workspace monorepo with a React frontend and an Express API.

## Structure

```
artifacts/
  dcl-consulting/   React 19 + Vite + TypeScript + Tailwind v4 marketing site
  api-server/       Express 5 + TypeScript API (OTP document delivery, etc.)
  mockup-sandbox/   Scratch/preview workspace, not part of the production site
lib/
  api-spec/         OpenAPI spec, source of truth for the API contract
  api-client-react/ Generated react-query hooks (via Orval, from api-spec)
  api-zod/          Generated Zod schemas (via Orval, from api-spec)
  db/               Drizzle/Postgres scaffolding (not currently in use)
```

Each page on the site follows the same pattern: a route in
`artifacts/dcl-consulting/src/App.tsx`, a page component in `src/pages/`,
one component per section under `src/components/<page>/`, and page copy in
a matching `src/data/<page>-content.ts` file.

## Getting started

Requires [pnpm](https://pnpm.io) (not npm/yarn — see the root
`package.json` preinstall check).

```bash
pnpm install
```

### Frontend (`artifacts/dcl-consulting`)

```bash
pnpm --filter @workspace/dcl-consulting run dev        # dev server
pnpm --filter @workspace/dcl-consulting run build       # production build
pnpm --filter @workspace/dcl-consulting run test         # vitest
pnpm --filter @workspace/dcl-consulting run typecheck
```

### API (`artifacts/api-server`)

Copy `artifacts/api-server/.env.example` to `.env` and fill in real values
before running in `resend` mail mode (the "Request More Info" OTP
document-delivery feature). See `artifacts/api-server/README.md` for the
full deployment requirement — this API needs a single, persistent-disk
instance, not an autoscaled/serverless one.

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run test
pnpm --filter @workspace/api-server run typecheck
```

### Whole workspace

```bash
pnpm run typecheck   # every package
pnpm run build       # typecheck, then build every package
```

## Deployment

Production target is [Render](https://render.com), as two services defined
in `render.yaml` at the repository root:

- **`dcl-frontend`** — a Static Site built from `artifacts/dcl-consulting`.
- **`dcl-api`** — a single-instance Node Web Service running
  `artifacts/api-server`, with a Persistent Disk mounted at `/var/data`
  for the OTP challenge store (see `artifacts/api-server/README.md`).

Both build from the repository root (not scoped into either artifact's own
directory) via `pnpm --filter`, since each depends on workspace packages
under `lib/`. See `render.yaml`'s comments for the exact commands, and the
project's operator for the manual one-time Render dashboard setup
(connecting the repo, entering secret env vars, adding the custom domains).

## Notable features

- **Request More Info** (`/contact`) — a real OTP-gated document-delivery
  flow: email verification, HMAC-hashed one-time codes, rate limiting, and
  Resend-based email delivery of DCL's PDF collateral.
- **Insights** (`/insights`) — an editorial hub page with a featured story,
  a varied perspective grid, and an article archive.
- Cinematic full-bleed video hero on the homepage, built with GSAP.

## Design system

Colors `#080A0D` `#171714` `#FFFFFF` `#F2F4F6` `#9CA3AA` `#C6E3FA` `#8BBFE8`,
Instrument Serif for headings, DM Sans for body/UI text.
