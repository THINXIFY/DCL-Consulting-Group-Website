# Secure "Request More Info" OTP Document Delivery System

Date: 2026-09-16
Scope: `artifacts/dcl-consulting` (frontend), `artifacts/api-server` (backend),
`lib/api-spec` + `lib/api-client-react` (API contract/codegen)

## Goal

A real, production-functioning feature on `/contact`: a visitor requests DCL
documents, verifies their email via a one-time 6-digit code, and (only after
server-side verification) receives the configured PDFs by email. No part of
this is a frontend-only mock — the OTP is generated, hashed, and checked
server-side, and email is actually sent through a real provider.

## Decisions from clarifying questions

- **Email provider:** Resend, isolated behind a `MailProvider` interface.
  Requires the user to supply `RESEND_API_KEY` (and a verified sending
  domain) before real mail can go out. Nothing else in this feature depends
  on that key being present yet.
- **PDF documents:** none exist in the repo. Generate two small, honest
  placeholder PDFs (Company Profile, Services Overview) containing only
  facts already published elsewhere on the site (name, number, director,
  registered office, jurisdiction) — no invented content. Built once via a
  throwaway script, not a runtime dependency.
- **Storage:** the project's Postgres + Drizzle package (`lib/db`) exists
  but has no `DATABASE_URL` provisioned in this environment. Per explicit
  instruction, skip it for now and use a single-instance, file-based store
  behind an interface that can be swapped for the Drizzle backend later
  without touching route logic.

## Non-goals

- No admin dashboard (explicitly excluded unless one already exists; it
  doesn't).
- No multi-instance-safe distributed store (documented limitation, not
  solved here — swapping to Postgres later is the intended fix).
- No marketing/CRM use of the submitted email.
- No changes to the global header/footer or the rest of the Contact page.

## Architecture overview

```
Contact page (React)
  -> "Request More Info" trigger (new, in CompanyInformation left column)
  -> RequestInfoModal (state machine: email -> sending -> otp -> verifying -> success | failure)
       -> generated API hooks (Orval, from lib/api-spec/openapi.yaml)
            -> POST /api/request-info/start   { email }              -> { requestId }
            -> POST /api/request-info/resend  { requestId }          -> { requestId }
            -> POST /api/request-info/verify  { requestId, code }    -> { status: 'sent' | 'failed' }

api-server
  routes/request-info.ts
    -> otpChallengeStore (file-based, artifacts/api-server/.data/)
    -> otp.ts            (generate, hash/verify with HMAC pepper)
    -> mail/             (MailProvider interface + ResendMailProvider + templates)
    -> documents.ts      (reads config/request-info-documents.ts manifest, loads PDFs from
                           artifacts/api-server/private/documents/, server-side only)
    -> rate limiting      (express-rate-limit, keyed by email and by IP)
```

## API contract (added to `lib/api-spec/openapi.yaml`)

Three operations under tag `request-info`, all `POST`, all JSON in/out,
matching the existing `/healthz` pattern (Zod schemas generated into
`@workspace/api-zod`, hooks generated into `lib/api-client-react`):

- `startRequestInfo` — `POST /request-info/start`
  - body: `{ email: string }`
  - 200: `{ requestId: string }`
  - 400: invalid email
  - 429: rate limited
  - Same response shape regardless of whether the email has requested
    before (no enumeration signal).

- `resendRequestInfoCode` — `POST /request-info/resend`
  - body: `{ requestId: string }`
  - 200: `{ requestId: string }` (same id; old OTP invalidated, new one sent)
  - 404/410: unknown or expired challenge
  - 429: cooldown still active / rate limited

- `verifyRequestInfoCode` — `POST /request-info/verify`
  - body: `{ requestId: string, code: string }`
  - 200: `{ status: 'sent' }` on successful verification *and* successful
    document delivery
  - 200: `{ status: 'failed' }` when verification succeeded but delivery
    failed (distinct from a wrong code, which is a 400)
  - 400: `{ error: 'invalid_code' | 'expired' | 'too_many_attempts' | 'not_found' }`
    (the frontend maps these to the exact copy the brief specifies; the
    server never returns a stack trace or internal detail)

`requestId` is an opaque random token (e.g. 24 bytes, base64url via
`crypto.randomBytes`). No email address ever appears in a URL, query
string, or the request id itself.

## OTP mechanics

- **Generation:** `crypto.randomInt(0, 1_000_000)` (Node's `node:crypto`,
  cryptographically secure), zero-padded to 6 digits. Never `Math.random()`.
- **Hashing:** a 6-digit code only has 1,000,000 possible values, so a bare
  SHA-256 hash is rainbow-table-able in seconds if the store ever leaks.
  Store `HMAC-SHA256(key = OTP_HASH_SECRET, message = code)` instead — a
  new required env var, generated once and kept secret. Verification
  recomputes the HMAC and does a constant-time comparison
  (`crypto.timingSafeEqual`).
- **Expiry:** `REQUEST_INFO_OTP_TTL_MINUTES` (default 10).
- **Attempts:** `REQUEST_INFO_MAX_ATTEMPTS` (default 5) per challenge; on
  the 6th wrong attempt the challenge is invalidated and the visitor must
  request a new code (frontend shows the same "too many attempts" copy the
  brief specifies).
- **Resend:** always invalidates the previous OTP (only one valid code per
  challenge at a time) and generates a fresh one; resets the resend
  cooldown timer.

## Storage: `OtpChallengeStore`

Interface (in `artifacts/api-server/src/lib/otp-challenge-store.ts`):

```ts
interface OtpChallenge {
  id: string;
  email: string; // normalized: trimmed + lowercased
  otpHash: string;
  createdAt: number;
  expiresAt: number;
  attemptCount: number;
  resendCount: number;
  lastSentAt: number;
  verified: boolean;
  verifiedAt: number | null;
  deliveryStatus: 'pending' | 'sending' | 'sent' | 'failed';
}

interface OtpChallengeStore {
  create(email: string, otpHash: string, ttlMs: number): Promise<OtpChallenge>;
  getById(id: string): Promise<OtpChallenge | undefined>;
  replaceOtp(id: string, otpHash: string, ttlMs: number): Promise<OtpChallenge>;
  incrementAttempts(id: string): Promise<OtpChallenge>;
  markVerified(id: string): Promise<OtpChallenge>;
  setDeliveryStatus(id: string, status: OtpChallenge['deliveryStatus']): Promise<OtpChallenge>;
  invalidate(id: string): Promise<void>;
}
```

File-based implementation: a single JSON file at
`artifacts/api-server/.data/request-info-challenges.json` (directory is
`.gitignore`d, created on first write), loaded into an in-memory `Map` on
first access and persisted after every mutation via a serialized write
queue (a promise chain, so concurrent mutations within one process never
interleave writes). A periodic sweep (on each write, cheaply) drops
challenges past `expiresAt + grace period` so the file doesn't grow
unbounded. Documented limitation: this is correct for a single running
instance; if this ever runs behind multiple autoscaled instances
simultaneously, challenges created on one instance won't be visible to
another. The interface boundary is exactly what makes swapping in the
already-scaffolded Drizzle/Postgres backend later a contained change (one
new file implementing the same interface, no route changes).

## Rate limiting

`express-rate-limit` (new dependency, no external store required for this
traffic level):

- `/request-info/start`: 5 requests/hour per normalized email (custom key
  generator reading the parsed body) and 15-20/hour per IP.
- `/request-info/resend`: shares the same per-email/per-IP buckets as
  `start` (a resend is still an OTP send).
- `/request-info/verify`: capped independently by the per-challenge
  `attemptCount` (not just IP), since that's the meaningful limit here.

Rate-limit responses are generic 429s with no detail about which limit was
hit.

## Email

`MailProvider` interface (`sendMail({ to, subject, html, text })`) with one
implementation, `ResendMailProvider`, reading `RESEND_API_KEY`,
`MAIL_FROM_EMAIL`, `MAIL_FROM_NAME` from env. Two templates, each with an
HTML version (inline styles, table-based layout for Outlook compatibility,
~600-640px wide, logo referenced via `${PUBLIC_SITE_URL}/images/brand/dcl-logo.png`)
and a plain-text fallback:

- OTP email: subject "Your DCL verification code", the exact copy from the
  brief, code expiry stated, no attachments.
- Document delivery email: subject "Your requested DCL documents", the
  exact copy from the brief, "VERIFIED DELIVERY" badge, PDF attachments
  with human-readable filenames from the manifest (never internal storage
  filenames).

Attachment size is summed before sending; if it would exceed Resend's
attachment limit, delivery is marked `failed` with a structured log rather
than silently dropping documents (no fallback download-link mechanism is
built now — out of scope until it's actually needed, but the check and the
`failed` status path exist so a future fallback has somewhere to hook in).

## Document manifest & storage

- `artifacts/api-server/config/request-info-documents.ts` — exports an
  array of `{ id, filename, filePath, enabled }`. `filePath` is relative to
  `artifacts/api-server/private/documents/` and resolved server-side with a
  path-traversal guard (reject anything that resolves outside that
  directory).
- `artifacts/api-server/private/documents/` — the actual PDFs, **not**
  under `public/`, never served by any static-file route, read only by the
  document-delivery code.
- Only `.pdf` is accepted; the manifest is trusted server config, never
  client input.
- `artifacts/api-server/private/documents/README.md` — how to add/replace
  a PDF, update the manifest, disable a document, filename/size guidance,
  and the deployment note about the filesystem being writable/readable on
  Replit's autoscale target (confirmed via `.replit-artifact/artifact.toml`
  — this is a real Node runtime, not an immutable serverless bundle, so
  reading a bundled private folder at request time is safe).

Two placeholder PDFs (`DCL-Company-Profile.pdf`, `DCL-Services-Overview.pdf`)
generated once via a throwaway local script (not added to any
`package.json`), containing only verified facts, clearly meant to be
replaced with real marketing collateral.

## Frontend: `RequestInfoModal`

- Location: `src/components/contact/RequestInfoModal.tsx`, mounted from
  `CompanyInformation.tsx` (which owns the open/close state); trigger is a
  third action in that section's left column, styled distinctly from the
  two existing CTAs (small icon + text, not a third full-width button).
- Real accessible dialog: `role="dialog"`, `aria-modal="true"`,
  labelled by the state's heading, focus moves in on open and is trapped,
  `Escape` closes (except mid-submit), focus returns to the trigger button
  on close.
- State machine (explicit union type, one component per state or one
  component with a `state` prop switch — decided during implementation
  based on how large each state's markup turns out to be):
  `email -> sending -> otp -> verifying -> success | failure`, plus
  `change email` (returns to `email`, invalidates the current challenge
  client-side by simply discarding `requestId` — the server-side challenge
  is left to expire naturally; no extra endpoint needed for this).
- Six-cell OTP input as its own small component
  (`src/components/contact/OtpCodeInput.tsx`): numeric-only, one digit per
  cell, auto-advance, backspace-back, full paste-fill, arrow-key
  navigation, `autoComplete="one-time-code"`, `inputMode="numeric"`.
- Resend cooldown: 60s countdown rendered client-side; the actual
  enforcement is server-side (rate limiting), the countdown is UX only.
- Uses the generated Orval hooks against the three new endpoints — no
  hand-rolled `fetch` calls, consistent with how the rest of the app would
  consume this API once codegen runs.
- Motion: GSAP (matching the rest of the site, not a second animation
  library), `gsap.context()` + `prefers-reduced-motion` branch exactly like
  every other animated component in `dcl-consulting`; open/close and
  state-to-state transitions are opacity + small translateY, ~250-400ms,
  `power2`/`power3` easing.

## Security checklist (from the brief, mapped to concrete mechanisms)

- Server is sole authority on `verified` — the verify endpoint is the only
  code path that flips `verified: true`, and delivery only reads that
  server-side flag, never a client-supplied boolean.
- Delivery destination is always `challenge.email`; the verify request body
  has no email field for this reason.
- No OTP, hash, email, or internal path ever appears in a URL or log line.
- Structured logs (via the existing `pino` logger already in
  `api-server`) for: challenge created, verification success/failure
  *category* (wrong code / expired / too many attempts), delivery
  started/succeeded/failed — never the OTP itself, never full email
  addresses at `info` level (log a truncated/hashed form if correlation is
  needed).
- `express.json()` already has a body size default; add an explicit small
  limit on these three routes specifically given they're public and
  unauthenticated.

## Environment variables (new)

Added to a new `artifacts/api-server/.env.example` (none currently exists):

```
RESEND_API_KEY=
MAIL_FROM_EMAIL=
MAIL_FROM_NAME=DCL Consulting and Investments Limited
PUBLIC_SITE_URL=https://dcl-consulting-group.com
OTP_HASH_SECRET=
REQUEST_INFO_OTP_TTL_MINUTES=10
REQUEST_INFO_MAX_ATTEMPTS=5
```

## Testing

Backend (Vitest, added to `api-server`, matching the test runner already
used in `dcl-consulting`): OTP generation shape, HMAC hash/verify
round-trip, expiry rejection, attempt-limit lockout, resend invalidates the
prior code, email normalization, verified-only delivery gating, idempotent
delivery (a `sent` challenge never sends twice), disabled documents
excluded, missing-file handled without crashing, rate-limit key behavior —
all against the file-based store and a fake `MailProvider` (no real network
calls in tests).

Frontend: the modal's state machine and `OtpCodeInput` behavior
(auto-advance, paste-fill, backspace) via Testing Library, mocking the
generated API hooks the same way other components in this codebase mock
their dependencies.

## Known limitations (explicit, not hidden)

- File-based store is single-instance only.
- Nothing here can be end-to-end verified against a real inbox until
  `RESEND_API_KEY` (and a verified sending domain) is supplied.
- The two PDFs are placeholders built from already-public facts, not real
  marketing collateral.
