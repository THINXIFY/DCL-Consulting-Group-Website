# api-server

Express 5 + TypeScript API for the DCL Consulting site, including the
`/api/request-info/*` "Request More Info" OTP document-delivery feature.

## Deployment requirement: single instance, persistent disk

The `Request More Info` OTP challenge store (`src/lib/otp-challenge-store.ts`,
`FileOtpChallengeStore`) persists pending OTP challenges to a single JSON
file on local disk (`.data/request-info-challenges.json`, gitignored).
This is a deliberate, simple design - no database - and it requires:

- **Exactly one running API instance.** Two concurrent instances each
  keep their own independent in-memory cache of that file; a challenge
  created on one instance is invisible to a request that lands on the
  other, so `/verify` or `/resend` would wrongly report `not_found`.
- **A writable, persistent local filesystem** for that one instance.

**This rules out serverless/edge runtimes (no persistent filesystem) and
any "autoscale to N instances" deployment mode**, regardless of
provider - e.g. Replit Autoscale, AWS Lambda, Vercel serverless/edge
functions, or a PaaS's horizontally-scaled web-service tier. It's fine
on a VPS, a single Docker container with a mounted volume, a Replit
Reserved VM, or any PaaS "web service" pinned to exactly one
instance/replica with a persistent disk attached.

**Decided production target: Render**, as a single-instance Web Service
(`plan: starter` or above) with a Persistent Disk mounted at `/var/data`
- see `render.yaml` at the repository root. `REQUEST_INFO_DATA_DIR` (see
`.env.example`) points `FileOtpChallengeStore` at that mount; it's unset
in local dev, which falls back to `.data/` inside this package.

A server restart or redeploy may invalidate any OTP challenges that were
pending at that moment (the visitor would need to click "Resend Code" or
restart the request-info flow). This is an accepted tradeoff, not a bug:
challenges already expire after ~10 minutes
(`REQUEST_INFO_OTP_TTL_MINUTES`), so the practical impact of an
occasional restart is a visitor re-requesting a code, not a lost or
corrupted request.

If this API is ever moved to a genuinely multi-instance or ephemeral
deployment target, `OtpChallengeStore` (the interface in the same file)
is the seam to swap `FileOtpChallengeStore` for a shared backing store -
but that migration is out of scope unless the deployment target actually
changes.

See `private/documents/README.md` for the same constraint as it applies
to reading the request-info PDF attachments.
