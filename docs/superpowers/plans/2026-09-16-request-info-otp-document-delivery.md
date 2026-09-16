# Secure "Request More Info" OTP Document Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real, working "Request More Info" feature on `/contact`: a visitor verifies their email with a server-generated 6-digit OTP, and only after server-side verification succeeds does the backend email them the configured DCL PDF documents.

**Architecture:** New `/api/request-info/*` routes in the existing Express 5 server (`artifacts/api-server`), added to the existing OpenAPI spec and consumed via the existing Orval-generated react-query hooks from the frontend (`artifacts/dcl-consulting`). OTP challenges are stored in a single-instance, file-based JSON store behind an interface (Postgres/Drizzle is available in this monorepo but explicitly deferred per the approved design). Email goes through a provider-isolated `MailProvider` (Resend in production, a console-logging provider for local dev — never a hardcoded OTP bypass).

**Tech Stack:** Express 5, TypeScript, Vitest + Supertest (new to `api-server`), `resend`, `express-rate-limit`, `pdfkit` (one-off script only, not a runtime dependency), React 18, `@tanstack/react-query` (already present), Orval-generated hooks, GSAP (already the site's only animation library).

**Source of truth:** `docs/superpowers/specs/2026-09-16-request-info-otp-document-delivery-design.md` — read it before starting if anything here seems to contradict it.

---

## File overview

| File | Purpose |
|---|---|
| `.gitignore` | Ignore real `.env` files and the new file-store data directory |
| `lib/api-spec/openapi.yaml` | Add the three `request-info` operations + schemas |
| `artifacts/api-server/package.json` | Add `vitest`, `supertest`, `resend`, `express-rate-limit` |
| `artifacts/api-server/vitest.config.ts` | New — test runner config |
| `artifacts/api-server/.env.example` | New — documents every env var this feature needs |
| `artifacts/api-server/src/lib/env.ts` | New — typed, validated env loader |
| `artifacts/api-server/src/lib/otp.ts` | New — OTP generation + HMAC hash/verify |
| `artifacts/api-server/src/lib/otp-challenge-store.ts` | New — `OtpChallengeStore` interface + file-based implementation |
| `artifacts/api-server/config/request-info-documents.ts` | New — the document manifest |
| `artifacts/api-server/src/lib/documents.ts` | New — safe manifest-driven PDF loader |
| `artifacts/api-server/private/documents/README.md` | New — how to manage the PDFs |
| `artifacts/api-server/private/documents/company-profile.pdf` | New — placeholder PDF |
| `artifacts/api-server/private/documents/services-overview.pdf` | New — placeholder PDF |
| `artifacts/api-server/src/mail/mail-provider.ts` | New — `MailProvider` interface |
| `artifacts/api-server/src/mail/console-mail-provider.ts` | New — dev-mode provider |
| `artifacts/api-server/src/mail/resend-mail-provider.ts` | New — production provider |
| `artifacts/api-server/src/mail/create-mail-provider.ts` | New — factory selecting provider by env |
| `artifacts/api-server/src/mail/templates/otp-email.ts` | New — OTP email HTML + text |
| `artifacts/api-server/src/mail/templates/documents-email.ts` | New — delivery email HTML + text |
| `artifacts/api-server/src/middlewares/request-info-rate-limit.ts` | New — rate limiters |
| `artifacts/api-server/src/routes/request-info.ts` | New — the three endpoints |
| `artifacts/api-server/src/routes/index.ts` | Modify — mount the new router with its composed dependencies |
| `artifacts/dcl-consulting/vite.config.ts` | Modify — dev-server proxy for `/api` |
| `artifacts/dcl-consulting/src/components/contact/OtpCodeInput.tsx` | New — 6-cell OTP input |
| `artifacts/dcl-consulting/src/components/contact/RequestInfoModal.tsx` | New — the full modal state machine |
| `artifacts/dcl-consulting/src/components/contact/CompanyInformation.tsx` | Modify — add the trigger + mount the modal |

---

### Task 1: Stop real secrets and local data from ever being committed

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the ignore patterns**

Append to the end of `.gitignore`:

```gitignore

# Environment variables (real secrets) - .env.example files are intentionally NOT ignored
.env
.env.local
.env.*.local

# Local file-backed data stores (e.g. artifacts/api-server/.data/)
.data/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "Ignore local .env files and file-store data directories"
```

---

### Task 2: Add a test runner to `api-server`

The server currently has no tests and no test runner. Match the `vitest` setup already used in `artifacts/dcl-consulting`.

**Files:**
- Modify: `artifacts/api-server/package.json`
- Create: `artifacts/api-server/vitest.config.ts`

- [ ] **Step 1: Add the dependency and script**

In `artifacts/api-server/package.json`, add to `"scripts"`:

```json
    "test": "vitest run",
```

Add to `"devDependencies"`:

```json
    "vitest": "^3.2.4",
    "supertest": "^7.1.1",
    "@types/supertest": "^6.0.3",
```

- [ ] **Step 2: Create the Vitest config**

```ts
// artifacts/api-server/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 3: Install and verify the runner works with zero tests**

```bash
pnpm install
pnpm --filter @workspace/api-server run test
```

Expected: exits 0 with "No test files found" (or similar) — that's fine, it proves the runner is wired up before any test exists.

- [ ] **Step 4: Commit**

```bash
git add artifacts/api-server/package.json artifacts/api-server/vitest.config.ts pnpm-lock.yaml
git commit -m "Add a Vitest test runner to api-server"
```

---

### Task 3: Add the API contract for the three new endpoints

**Files:**
- Modify: `lib/api-spec/openapi.yaml`

- [ ] **Step 1: Add the paths**

Insert into the `paths:` section (after the existing `/healthz` entry):

```yaml
  /request-info/start:
    post:
      operationId: startRequestInfo
      tags: [request-info]
      summary: Begin a document request by verifying an email address
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/StartRequestInfoBody"
      responses:
        "200":
          description: Verification code sent
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/StartRequestInfoResponse"
        "400":
          description: Invalid email
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RequestInfoError"
        "429":
          description: Rate limited
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RequestInfoError"
  /request-info/resend:
    post:
      operationId: resendRequestInfoCode
      tags: [request-info]
      summary: Invalidate the current code and send a new one
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ResendRequestInfoBody"
      responses:
        "200":
          description: New verification code sent
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ResendRequestInfoResponse"
        "404":
          description: Unknown, already-verified, or expired challenge
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RequestInfoError"
        "429":
          description: Rate limited or resend cooldown still active
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RequestInfoError"
  /request-info/verify:
    post:
      operationId: verifyRequestInfoCode
      tags: [request-info]
      summary: Verify the code and, on success, deliver the requested documents
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/VerifyRequestInfoBody"
      responses:
        "200":
          description: Verified; documents were sent, or delivery failed after verification
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/VerifyRequestInfoResponse"
        "400":
          description: Verification failed
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RequestInfoError"
```

- [ ] **Step 2: Add the tag**

Add to the top-level `tags:` list:

```yaml
  - name: request-info
    description: Secure document request (email verification + delivery)
```

- [ ] **Step 3: Add the schemas**

Insert into `components.schemas` (after `HealthStatus`):

```yaml
    StartRequestInfoBody:
      type: object
      properties:
        email:
          type: string
          format: email
      required: [email]
    StartRequestInfoResponse:
      type: object
      properties:
        requestId:
          type: string
      required: [requestId]
    ResendRequestInfoBody:
      type: object
      properties:
        requestId:
          type: string
      required: [requestId]
    ResendRequestInfoResponse:
      type: object
      properties:
        requestId:
          type: string
      required: [requestId]
    VerifyRequestInfoBody:
      type: object
      properties:
        requestId:
          type: string
        code:
          type: string
      required: [requestId, code]
    VerifyRequestInfoResponse:
      type: object
      properties:
        status:
          type: string
          enum: [sent, failed]
      required: [status]
    RequestInfoError:
      type: object
      properties:
        error:
          type: string
          enum:
            - invalid_email
            - invalid_code
            - expired
            - too_many_attempts
            - not_found
            - rate_limited
            - mail_failure
      required: [error]
```

- [ ] **Step 4: Run codegen**

```bash
pnpm --filter @workspace/api-spec run codegen
```

Expected: regenerates files under `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/`, then runs `typecheck:libs` with no errors.

- [ ] **Step 5: Read the generated hook names before writing any frontend code**

```bash
grep -n "^export function use" lib/api-client-react/src/generated/api.ts
```

Note the exact exported hook names (expected to be `useStartRequestInfo`, `useResendRequestInfoCode`, `useVerifyRequestInfoCode` given the `operationId`s above — Orval's react-query mode names mutation hooks `use<OperationId>`). If they differ, use the real names in Task 15.

- [ ] **Step 6: Commit**

```bash
git add lib/api-spec/openapi.yaml lib/api-client-react/src/generated lib/api-zod/src/generated
git commit -m "Add request-info OTP endpoints to the API contract and regenerate clients"
```

---

### Task 4: Typed environment config for the feature

**Files:**
- Create: `artifacts/api-server/.env.example`
- Create: `artifacts/api-server/src/lib/env.ts`
- Test: `artifacts/api-server/src/lib/env.test.ts`

- [ ] **Step 1: Write `.env.example`**

```bash
# artifacts/api-server/.env.example

# Required by the base server (see src/index.ts)
PORT=8080

# --- Request More Info (OTP document delivery) ---

# Secret key used to HMAC OTP codes before they're stored. Generate a real
# random value for every environment, e.g.: openssl rand -hex 32
OTP_HASH_SECRET=

# Minutes before an issued OTP expires.
REQUEST_INFO_OTP_TTL_MINUTES=10

# Failed verification attempts allowed per OTP challenge before it is invalidated.
REQUEST_INFO_MAX_ATTEMPTS=5

# "console" (default) logs emails instead of sending them - safe for local
# development, never used in production. Set to "resend" to send real email.
MAIL_PROVIDER=console

# Required when MAIL_PROVIDER=resend.
RESEND_API_KEY=

# The "From" address/name used on outgoing mail.
MAIL_FROM_EMAIL=no-reply@dcl-consulting-group.com
MAIL_FROM_NAME=DCL Consulting and Investments Limited

# Used to build absolute asset URLs (e.g. the logo) inside emails.
PUBLIC_SITE_URL=https://dcl-consulting-group.com
```

- [ ] **Step 2: Write the failing test**

```ts
// artifacts/api-server/src/lib/env.test.ts
import { afterEach, describe, expect, it } from "vitest";
import { loadRequestInfoEnv } from "./env";

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  for (const key of Object.keys(process.env)) delete process.env[key];
  Object.assign(process.env, ORIGINAL_ENV);
}

describe("loadRequestInfoEnv", () => {
  afterEach(resetEnv);

  it("throws when OTP_HASH_SECRET is missing", () => {
    delete process.env.OTP_HASH_SECRET;
    expect(() => loadRequestInfoEnv()).toThrow(/OTP_HASH_SECRET/);
  });

  it("applies defaults for optional settings", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    delete process.env.REQUEST_INFO_OTP_TTL_MINUTES;
    delete process.env.REQUEST_INFO_MAX_ATTEMPTS;
    delete process.env.MAIL_PROVIDER;
    const env = loadRequestInfoEnv();
    expect(env.otpTtlMinutes).toBe(10);
    expect(env.maxAttempts).toBe(5);
    expect(env.mailProvider).toBe("console");
  });

  it("requires RESEND_API_KEY when MAIL_PROVIDER is resend", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.MAIL_PROVIDER = "resend";
    delete process.env.RESEND_API_KEY;
    expect(() => loadRequestInfoEnv()).toThrow(/RESEND_API_KEY/);
  });

  it("rejects a non-positive-integer TTL", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.REQUEST_INFO_OTP_TTL_MINUTES = "0";
    expect(() => loadRequestInfoEnv()).toThrow(/REQUEST_INFO_OTP_TTL_MINUTES/);
  });

  it("strips a trailing slash from PUBLIC_SITE_URL", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.PUBLIC_SITE_URL = "https://example.com/";
    expect(loadRequestInfoEnv().publicSiteUrl).toBe("https://example.com");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
pnpm --filter @workspace/api-server run test -- env.test.ts
```

Expected: FAIL — `./env` does not exist yet.

- [ ] **Step 3: Implement**

```ts
// artifacts/api-server/src/lib/env.ts
export interface RequestInfoEnv {
  otpHashSecret: string;
  otpTtlMinutes: number;
  maxAttempts: number;
  mailProvider: "resend" | "console";
  resendApiKey: string | null;
  mailFromEmail: string;
  mailFromName: string;
  publicSiteUrl: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required but was not provided.`);
  }
  return value;
}

function parsePositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer, got "${raw}".`);
  }
  return value;
}

export function loadRequestInfoEnv(): RequestInfoEnv {
  const mailProvider = (process.env.MAIL_PROVIDER ?? "console") as "resend" | "console";
  if (mailProvider !== "resend" && mailProvider !== "console") {
    throw new Error(`MAIL_PROVIDER must be "resend" or "console", got "${mailProvider}".`);
  }
  if (mailProvider === "resend" && !process.env.RESEND_API_KEY) {
    throw new Error('MAIL_PROVIDER is "resend" but RESEND_API_KEY is not set.');
  }

  return {
    otpHashSecret: requireEnv("OTP_HASH_SECRET"),
    otpTtlMinutes: parsePositiveInt("REQUEST_INFO_OTP_TTL_MINUTES", 10),
    maxAttempts: parsePositiveInt("REQUEST_INFO_MAX_ATTEMPTS", 5),
    mailProvider,
    resendApiKey: process.env.RESEND_API_KEY ?? null,
    mailFromEmail: process.env.MAIL_FROM_EMAIL ?? "no-reply@example.com",
    mailFromName: process.env.MAIL_FROM_NAME ?? "DCL Consulting and Investments Limited",
    publicSiteUrl: (process.env.PUBLIC_SITE_URL ?? "https://dcl-consulting-group.com").replace(/\/+$/, ""),
  };
}
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
pnpm --filter @workspace/api-server run test -- env.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add artifacts/api-server/.env.example artifacts/api-server/src/lib/env.ts artifacts/api-server/src/lib/env.test.ts
git commit -m "Add typed, validated env config for the request-info feature"
```

---

### Task 5: OTP generation and secure hashing

**Files:**
- Create: `artifacts/api-server/src/lib/otp.ts`
- Test: `artifacts/api-server/src/lib/otp.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// artifacts/api-server/src/lib/otp.test.ts
import { describe, expect, it } from "vitest";
import { generateOtp, hashOtp, verifyOtp } from "./otp";

describe("otp", () => {
  it("generates a six-digit numeric string, zero-padded", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/);
    }
  });

  it("generates varied values, including some with a leading zero", () => {
    const codes = Array.from({ length: 500 }, () => generateOtp());
    expect(new Set(codes).size).toBeGreaterThan(1);
    expect(codes.some((c) => c.startsWith("0"))).toBe(true);
  });

  it("hash/verify round-trips for the correct code", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("384271", hash, "secret-a")).toBe(true);
  });

  it("rejects an incorrect code", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("905162", hash, "secret-a")).toBe(false);
  });

  it("rejects the correct code hashed under a different secret", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("384271", hash, "secret-b")).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
pnpm --filter @workspace/api-server run test -- otp.test.ts
```

Expected: FAIL — `./otp` does not exist yet.

- [ ] **Step 3: Implement**

```ts
// artifacts/api-server/src/lib/otp.ts
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Cryptographically secure 6-digit code (never Math.random()). A 6-digit
 * code has only 1,000,000 possible values, which is why it's HMAC'd with a
 * server secret before storage (see hashOtp) rather than hashed plain -
 * a bare hash of such a small keyspace is rainbow-table-able in seconds.
 */
export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(code: string, secret: string): string {
  return createHmac("sha256", secret).update(code).digest("hex");
}

export function verifyOtp(code: string, hash: string, secret: string): boolean {
  const candidate = Buffer.from(hashOtp(code, secret), "hex");
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
pnpm --filter @workspace/api-server run test -- otp.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add artifacts/api-server/src/lib/otp.ts artifacts/api-server/src/lib/otp.test.ts
git commit -m "Add secure OTP generation and HMAC hash/verify"
```

---

### Task 6: File-based OTP challenge store

**Files:**
- Create: `artifacts/api-server/src/lib/otp-challenge-store.ts`
- Test: `artifacts/api-server/src/lib/otp-challenge-store.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// artifacts/api-server/src/lib/otp-challenge-store.test.ts
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FileOtpChallengeStore } from "./otp-challenge-store";

let dir: string;
let store: FileOtpChallengeStore;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "otp-store-test-"));
  store = new FileOtpChallengeStore(path.join(dir, "challenges.json"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("FileOtpChallengeStore", () => {
  it("creates and retrieves a challenge with the expected defaults", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const found = await store.getById(created.id);
    expect(found).toEqual(created);
    expect(found?.deliveryStatus).toBe("pending");
    expect(found?.verified).toBe(false);
    expect(found?.attemptCount).toBe(0);
  });

  it("replaceOtp swaps the hash, resets attempts, and bumps resendCount", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.incrementAttempts(created.id);
    const replaced = await store.replaceOtp(created.id, "hash2", 10 * 60 * 1000);
    expect(replaced.otpHash).toBe("hash2");
    expect(replaced.attemptCount).toBe(0);
    expect(replaced.resendCount).toBe(1);
  });

  it("tracks attempt count across calls", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.incrementAttempts(created.id);
    const twice = await store.incrementAttempts(created.id);
    expect(twice.attemptCount).toBe(2);
  });

  it("marks verified with a timestamp", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const verified = await store.markVerified(created.id);
    expect(verified.verified).toBe(true);
    expect(verified.verifiedAt).not.toBeNull();
  });

  it("tracks delivery status transitions", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.setDeliveryStatus(created.id, "sending");
    const sent = await store.setDeliveryStatus(created.id, "sent");
    expect(sent.deliveryStatus).toBe("sent");
  });

  it("invalidate removes the challenge", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.invalidate(created.id);
    expect(await store.getById(created.id)).toBeUndefined();
  });

  it("persists to disk and is readable from a fresh store instance", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const secondInstance = new FileOtpChallengeStore(path.join(dir, "challenges.json"));
    const found = await secondInstance.getById(created.id);
    expect(found?.id).toBe(created.id);
    expect(found?.email).toBe("visitor@example.com");
  });

  it("throws a clear error when mutating an unknown id", async () => {
    await expect(store.incrementAttempts("does-not-exist")).rejects.toThrow(/No OTP challenge/);
  });

  it("handles concurrent writes without corrupting the file", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await Promise.all([
      store.incrementAttempts(created.id),
      store.incrementAttempts(created.id),
      store.incrementAttempts(created.id),
    ]);
    const final = await store.getById(created.id);
    expect(final?.attemptCount).toBe(3);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
pnpm --filter @workspace/api-server run test -- otp-challenge-store.test.ts
```

Expected: FAIL — `./otp-challenge-store` does not exist yet.

- [ ] **Step 3: Implement**

```ts
// artifacts/api-server/src/lib/otp-challenge-store.ts
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type DeliveryStatus = "pending" | "sending" | "sent" | "failed";

export interface OtpChallenge {
  id: string;
  email: string;
  otpHash: string;
  createdAt: number;
  expiresAt: number;
  attemptCount: number;
  resendCount: number;
  lastSentAt: number;
  verified: boolean;
  verifiedAt: number | null;
  deliveryStatus: DeliveryStatus;
}

export interface OtpChallengeStore {
  create(email: string, otpHash: string, ttlMs: number): Promise<OtpChallenge>;
  getById(id: string): Promise<OtpChallenge | undefined>;
  replaceOtp(id: string, otpHash: string, ttlMs: number): Promise<OtpChallenge>;
  incrementAttempts(id: string): Promise<OtpChallenge>;
  markVerified(id: string): Promise<OtpChallenge>;
  setDeliveryStatus(id: string, status: DeliveryStatus): Promise<OtpChallenge>;
  invalidate(id: string): Promise<void>;
}

function generateId(): string {
  return randomBytes(18).toString("base64url");
}

// Keep expired challenges around briefly for audit/idempotency checks, then
// let the periodic prune (run on every write) drop them so the file never
// grows unbounded.
const EXPIRED_RETENTION_MS = 60 * 60 * 1000;

/**
 * Single-instance, file-backed implementation. Correct for one running
 * process; if this server is ever scaled to multiple concurrent instances,
 * a challenge created on one instance won't be visible on another. The
 * interface above is the seam for swapping in the already-scaffolded
 * Drizzle/Postgres package (lib/db) later without touching route logic.
 */
export class FileOtpChallengeStore implements OtpChallengeStore {
  private cache: Map<string, OtpChallenge> | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  private async load(): Promise<Map<string, OtpChallenge>> {
    if (this.cache) return this.cache;
    try {
      const raw = await readFile(this.filePath, "utf8");
      const entries = JSON.parse(raw) as OtpChallenge[];
      this.cache = new Map(entries.map((entry) => [entry.id, entry]));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      this.cache = new Map();
    }
    return this.cache;
  }

  private async persist(): Promise<void> {
    const map = await this.load();
    const now = Date.now();
    for (const [id, challenge] of map) {
      if (challenge.expiresAt + EXPIRED_RETENTION_MS < now) map.delete(id);
    }
    const data = JSON.stringify(Array.from(map.values()));
    // Serialize writes through a promise chain so concurrent mutations in
    // this process never interleave partial file writes.
    this.writeQueue = this.writeQueue.then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      await writeFile(this.filePath, data, "utf8");
    });
    await this.writeQueue;
  }

  async create(email: string, otpHash: string, ttlMs: number): Promise<OtpChallenge> {
    const map = await this.load();
    const now = Date.now();
    const challenge: OtpChallenge = {
      id: generateId(),
      email,
      otpHash,
      createdAt: now,
      expiresAt: now + ttlMs,
      attemptCount: 0,
      resendCount: 0,
      lastSentAt: now,
      verified: false,
      verifiedAt: null,
      deliveryStatus: "pending",
    };
    map.set(challenge.id, challenge);
    await this.persist();
    return challenge;
  }

  async getById(id: string): Promise<OtpChallenge | undefined> {
    const map = await this.load();
    return map.get(id);
  }

  private async mustGet(id: string): Promise<OtpChallenge> {
    const challenge = await this.getById(id);
    if (!challenge) throw new Error(`No OTP challenge found for id "${id}".`);
    return challenge;
  }

  async replaceOtp(id: string, otpHash: string, ttlMs: number): Promise<OtpChallenge> {
    const challenge = await this.mustGet(id);
    const now = Date.now();
    challenge.otpHash = otpHash;
    challenge.expiresAt = now + ttlMs;
    challenge.attemptCount = 0;
    challenge.resendCount += 1;
    challenge.lastSentAt = now;
    await this.persist();
    return challenge;
  }

  async incrementAttempts(id: string): Promise<OtpChallenge> {
    const challenge = await this.mustGet(id);
    challenge.attemptCount += 1;
    await this.persist();
    return challenge;
  }

  async markVerified(id: string): Promise<OtpChallenge> {
    const challenge = await this.mustGet(id);
    challenge.verified = true;
    challenge.verifiedAt = Date.now();
    await this.persist();
    return challenge;
  }

  async setDeliveryStatus(id: string, status: DeliveryStatus): Promise<OtpChallenge> {
    const challenge = await this.mustGet(id);
    challenge.deliveryStatus = status;
    await this.persist();
    return challenge;
  }

  async invalidate(id: string): Promise<void> {
    const map = await this.load();
    map.delete(id);
    await this.persist();
  }
}
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
pnpm --filter @workspace/api-server run test -- otp-challenge-store.test.ts
```

Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add artifacts/api-server/src/lib/otp-challenge-store.ts artifacts/api-server/src/lib/otp-challenge-store.test.ts
git commit -m "Add a file-backed OtpChallengeStore behind a swappable interface"
```

---

### Task 7: Document manifest and safe loader

**Files:**
- Create: `artifacts/api-server/config/request-info-documents.ts`
- Create: `artifacts/api-server/src/lib/documents.ts`
- Test: `artifacts/api-server/src/lib/documents.test.ts`
- Create: `artifacts/api-server/private/documents/README.md`

- [ ] **Step 1: Write the manifest**

```ts
// artifacts/api-server/config/request-info-documents.ts
export interface RequestInfoDocument {
  id: string;
  /** Human-readable filename the recipient sees as the email attachment. */
  filename: string;
  /** Path relative to artifacts/api-server/private/documents/. */
  filePath: string;
  enabled: boolean;
}

export const requestInfoDocuments: RequestInfoDocument[] = [
  {
    id: "company-profile",
    filename: "DCL-Company-Profile.pdf",
    filePath: "company-profile.pdf",
    enabled: true,
  },
  {
    id: "services-overview",
    filename: "DCL-Services-Overview.pdf",
    filePath: "services-overview.pdf",
    enabled: true,
  },
];
```

- [ ] **Step 2: Write the failing test**

```ts
// artifacts/api-server/src/lib/documents.test.ts
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadEnabledDocuments } from "./documents";
import type { RequestInfoDocument } from "../../config/request-info-documents";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "docs-test-"));
  await writeFile(path.join(dir, "a.pdf"), "pdf-a-content");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("loadEnabledDocuments", () => {
  it("loads only enabled documents", async () => {
    const manifest: RequestInfoDocument[] = [
      { id: "a", filename: "A.pdf", filePath: "a.pdf", enabled: true },
      { id: "b", filename: "B.pdf", filePath: "b.pdf", enabled: false },
    ];
    const loaded = await loadEnabledDocuments(manifest, dir);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].filename).toBe("A.pdf");
  });

  it("uses the manifest's human-readable filename, not the internal path", async () => {
    const manifest: RequestInfoDocument[] = [
      { id: "a", filename: "DCL-Company-Profile.pdf", filePath: "a.pdf", enabled: true },
    ];
    const loaded = await loadEnabledDocuments(manifest, dir);
    expect(loaded[0].filename).toBe("DCL-Company-Profile.pdf");
  });

  it("skips a missing file without throwing", async () => {
    const manifest: RequestInfoDocument[] = [
      { id: "missing", filename: "Missing.pdf", filePath: "missing.pdf", enabled: true },
      { id: "a", filename: "A.pdf", filePath: "a.pdf", enabled: true },
    ];
    const loaded = await loadEnabledDocuments(manifest, dir);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].filename).toBe("A.pdf");
  });

  it("rejects a path that escapes the documents root", async () => {
    const manifest: RequestInfoDocument[] = [
      { id: "escape", filename: "Escape.pdf", filePath: "../escape.pdf", enabled: true },
    ];
    await expect(loadEnabledDocuments(manifest, dir)).rejects.toThrow(/outside/);
  });

  it("rejects a non-PDF file even if enabled", async () => {
    await writeFile(path.join(dir, "c.txt"), "not a pdf");
    const manifest: RequestInfoDocument[] = [{ id: "c", filename: "C.pdf", filePath: "c.txt", enabled: true }];
    await expect(loadEnabledDocuments(manifest, dir)).rejects.toThrow(/PDF/);
  });
});
```

- [ ] **Step 3: Run it to confirm it fails**

```bash
pnpm --filter @workspace/api-server run test -- documents.test.ts
```

Expected: FAIL — `./documents` does not exist yet.

- [ ] **Step 4: Implement**

```ts
// artifacts/api-server/src/lib/documents.ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import { requestInfoDocuments, type RequestInfoDocument } from "../../config/request-info-documents";
import { logger } from "./logger";

export const DOCUMENTS_ROOT = path.resolve(import.meta.dirname, "..", "..", "private", "documents");

export interface LoadedDocument {
  filename: string;
  content: Buffer;
}

function resolveSafePath(filePath: string, root: string): string {
  const resolved = path.resolve(root, filePath);
  if (!resolved.startsWith(root + path.sep)) {
    throw new Error(`Refusing to read document outside the private documents directory: "${filePath}"`);
  }
  if (path.extname(resolved).toLowerCase() !== ".pdf") {
    throw new Error(`Refusing to read a non-PDF document: "${filePath}"`);
  }
  return resolved;
}

/**
 * Loads every enabled document from the trusted server-side manifest. A bad
 * manifest entry (path traversal, non-PDF) throws immediately - that's a
 * configuration bug, not a runtime condition. A genuinely missing file is
 * logged and skipped so one bad document never blocks the others.
 */
export async function loadEnabledDocuments(
  manifest: RequestInfoDocument[] = requestInfoDocuments,
  documentsRoot: string = DOCUMENTS_ROOT,
): Promise<LoadedDocument[]> {
  const loaded: LoadedDocument[] = [];

  for (const doc of manifest) {
    if (!doc.enabled) continue;

    const resolvedPath = resolveSafePath(doc.filePath, documentsRoot);
    try {
      const content = await readFile(resolvedPath);
      loaded.push({ filename: doc.filename, content });
    } catch {
      logger.error({ documentId: doc.id }, "Failed to read a request-info document; skipping it");
    }
  }

  return loaded;
}
```

- [ ] **Step 5: Run it to confirm it passes**

```bash
pnpm --filter @workspace/api-server run test -- documents.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 6: Write the admin README**

```markdown
<!-- artifacts/api-server/private/documents/README.md -->
# Request-info documents

PDFs in this folder are emailed to visitors who verify their email through
the "Request More Info" flow on `/contact`. This folder is **not** served
publicly - it's read server-side only, by `src/lib/documents.ts`.

## Adding a document

1. Drop a `.pdf` file into this folder.
2. Add an entry to `config/request-info-documents.ts`:

   ```ts
   {
     id: "unique-id",
     filename: "DCL-Human-Readable-Name.pdf", // shown as the email attachment name
     filePath: "your-file.pdf",               // relative to this folder
     enabled: true,
   }
   ```

## Supported file type

`.pdf` only. Any other extension is rejected before it's read.

## Disabling a document

Set `enabled: false` on its manifest entry - no need to delete the file or
touch delivery code.

## Attachment size

Resend's attachment limit applies to the *sum* of all enabled documents.
Keep each PDF modest (a few MB at most); the delivery code sums attachment
sizes before sending and marks delivery `failed` (with a log entry) rather
than silently dropping documents if the total is too large.

## Deployment

This server runs as a real Node process (Replit's `autoscale` deployment
target, not an immutable serverless bundle - see
`artifacts/api-server/.replit-artifact/artifact.toml`), so reading files
from this folder at request time works the same in development and
production. If this ever moves to a genuinely immutable/serverless
runtime, these files would need to move to object storage instead - the
`loadEnabledDocuments` function is the only place that would need to change.
```

- [ ] **Step 7: Commit**

```bash
git add artifacts/api-server/config artifacts/api-server/src/lib/documents.ts artifacts/api-server/src/lib/documents.test.ts artifacts/api-server/private/documents/README.md
git commit -m "Add the document manifest and a safe, manifest-driven PDF loader"
```

---

### Task 8: Generate the two placeholder PDFs

These are real files containing only facts already published elsewhere on
the DCL site - not invented content, and not a runtime dependency (pdfkit
is installed in a scratch directory just to produce the files once).

- [ ] **Step 1: Set up a scratch directory and install pdfkit there**

```bash
mkdir -p /tmp/dcl-pdf-gen && cd /tmp/dcl-pdf-gen
npm init -y
npm install pdfkit
```

- [ ] **Step 2: Write the generator script**

```js
// /tmp/dcl-pdf-gen/generate.mjs
import PDFDocument from "pdfkit";
import fs from "node:fs";

const INK = "#080a0d";
const MUTED_LABEL = "#8a939b";
const BODY = "#35404a";

function renderDoc(outPath, title, extraRows) {
  const doc = new PDFDocument({ size: "A4", margin: 56 });
  doc.pipe(fs.createWriteStream(outPath));

  doc.fillColor(INK).fontSize(10).text("DCL CONSULTING AND INVESTMENTS LIMITED", { characterSpacing: 1 });
  doc.moveDown(1.5);
  doc.fontSize(24).text(title);
  doc.moveDown(1);
  doc
    .fontSize(11)
    .fillColor(BODY)
    .text(
      "This document is a placeholder generated from information already published on the DCL website. " +
        "Replace this file with finished marketing collateral before relying on it for external distribution.",
      { width: 460 },
    );
  doc.moveDown(1.5);

  const rows = [
    ["Company", "DCL Consulting and Investments Limited"],
    ["Company Number", "10086906"],
    ["Director", "David Christopher Lebond"],
    ["Jurisdiction", "England and Wales"],
    ["Registered Office", "3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF"],
    ["Website", "dcl-consulting-group.com"],
    ...extraRows,
  ];

  for (const [label, value] of rows) {
    doc.fontSize(9).fillColor(MUTED_LABEL).text(label.toUpperCase(), { characterSpacing: 1 });
    doc.fontSize(13).fillColor(INK).text(value);
    doc.moveDown(0.8);
  }

  doc.end();
}

renderDoc("./DCL-Company-Profile.pdf", "Company Profile", []);
renderDoc("./DCL-Services-Overview.pdf", "Services Overview", []);
```

- [ ] **Step 3: Run it**

```bash
node generate.mjs
ls -la DCL-Company-Profile.pdf DCL-Services-Overview.pdf
```

Expected: both files exist and are non-trivial in size (a few KB).

- [ ] **Step 4: Copy the output into the project under the manifest's expected filenames**

```bash
cp DCL-Company-Profile.pdf "<repo>/artifacts/api-server/private/documents/company-profile.pdf"
cp DCL-Services-Overview.pdf "<repo>/artifacts/api-server/private/documents/services-overview.pdf"
```

- [ ] **Step 5: Discard the scratch directory (pdfkit is not a project dependency)**

```bash
rm -rf /tmp/dcl-pdf-gen
```

- [ ] **Step 6: Commit the generated PDFs**

```bash
git add artifacts/api-server/private/documents/company-profile.pdf artifacts/api-server/private/documents/services-overview.pdf
git commit -m "Add placeholder company-profile and services-overview PDFs"
```

---

### Task 9: Mail provider abstraction (console + Resend)

**Files:**
- Modify: `artifacts/api-server/package.json` (add `resend`)
- Create: `artifacts/api-server/src/mail/mail-provider.ts`
- Create: `artifacts/api-server/src/mail/console-mail-provider.ts`
- Create: `artifacts/api-server/src/mail/resend-mail-provider.ts`
- Create: `artifacts/api-server/src/mail/create-mail-provider.ts`
- Test: `artifacts/api-server/src/mail/console-mail-provider.test.ts`
- Test: `artifacts/api-server/src/mail/create-mail-provider.test.ts`

- [ ] **Step 1: Add the dependency**

In `artifacts/api-server/package.json`, add to `"dependencies"`:

```json
    "resend": "^4.0.1",
```

```bash
pnpm install
```

- [ ] **Step 2: Write the interface**

```ts
// artifacts/api-server/src/mail/mail-provider.ts
export interface MailAttachment {
  filename: string;
  content: Buffer;
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: MailAttachment[];
}

export interface MailProvider {
  sendMail(input: SendMailInput): Promise<void>;
}
```

- [ ] **Step 3: Write the failing test for the console provider**

```ts
// artifacts/api-server/src/mail/console-mail-provider.test.ts
import { describe, expect, it, vi } from "vitest";
import { ConsoleMailProvider } from "./console-mail-provider";

describe("ConsoleMailProvider", () => {
  it("logs the email instead of sending it, and never logs a would-be OTP as plaintext outside the intended preview field", async () => {
    const info = vi.fn();
    const provider = new ConsoleMailProvider({ info } as never);

    await provider.sendMail({
      to: "visitor@example.com",
      subject: "Your DCL verification code",
      html: "<p>384271</p>",
      text: "384271",
    });

    expect(info).toHaveBeenCalledTimes(1);
    const [meta, message] = info.mock.calls[0];
    expect(meta.to).toBe("visitor@example.com");
    expect(meta.subject).toBe("Your DCL verification code");
    expect(typeof message).toBe("string");
  });
});
```

- [ ] **Step 4: Run it to confirm it fails**

```bash
pnpm --filter @workspace/api-server run test -- console-mail-provider.test.ts
```

Expected: FAIL — `./console-mail-provider` does not exist yet.

- [ ] **Step 5: Implement the console provider**

```ts
// artifacts/api-server/src/mail/console-mail-provider.ts
import type { Logger } from "pino";
import type { MailProvider, SendMailInput } from "./mail-provider";

/**
 * Local-development mail provider: logs the email instead of sending it.
 * Selected only when MAIL_PROVIDER=console (the default). This is how a
 * developer sees the OTP locally without a real Resend account - the OTP
 * is never displayed in the actual product UI, only in this server log.
 */
export class ConsoleMailProvider implements MailProvider {
  constructor(private readonly logger: Pick<Logger, "info">) {}

  async sendMail(input: SendMailInput): Promise<void> {
    this.logger.info(
      {
        to: input.to,
        subject: input.subject,
        attachmentCount: input.attachments?.length ?? 0,
      },
      `[console-mail-provider] Not actually sent (set MAIL_PROVIDER=resend for real delivery). Preview:\n${input.text}`,
    );
  }
}
```

- [ ] **Step 6: Implement the Resend provider (no dedicated test - it makes a real network call; covered indirectly by the route tests using a fake `MailProvider`)**

```ts
// artifacts/api-server/src/mail/resend-mail-provider.ts
import { Resend } from "resend";
import type { MailProvider, SendMailInput } from "./mail-provider";

export class ResendMailProvider implements MailProvider {
  private readonly client: Resend;

  constructor(
    apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string,
  ) {
    this.client = new Resend(apiKey);
  }

  async sendMail(input: SendMailInput): Promise<void> {
    const result = await this.client.emails.send({
      from: `${this.fromName} <${this.fromEmail}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    });

    if (result.error) {
      throw new Error(`Resend failed to send mail: ${result.error.message}`);
    }
  }
}
```

- [ ] **Step 7: Write the failing test for the factory**

```ts
// artifacts/api-server/src/mail/create-mail-provider.test.ts
import { describe, expect, it } from "vitest";
import { createMailProvider } from "./create-mail-provider";
import { ConsoleMailProvider } from "./console-mail-provider";
import { ResendMailProvider } from "./resend-mail-provider";
import type { RequestInfoEnv } from "../lib/env";

function envWith(overrides: Partial<RequestInfoEnv>): RequestInfoEnv {
  return {
    otpHashSecret: "secret",
    otpTtlMinutes: 10,
    maxAttempts: 5,
    mailProvider: "console",
    resendApiKey: null,
    mailFromEmail: "no-reply@example.com",
    mailFromName: "DCL",
    publicSiteUrl: "https://example.com",
    ...overrides,
  };
}

describe("createMailProvider", () => {
  it("returns a ConsoleMailProvider when mailProvider is console", () => {
    expect(createMailProvider(envWith({ mailProvider: "console" }))).toBeInstanceOf(ConsoleMailProvider);
  });

  it("returns a ResendMailProvider when mailProvider is resend and a key is present", () => {
    expect(
      createMailProvider(envWith({ mailProvider: "resend", resendApiKey: "re_test_key" })),
    ).toBeInstanceOf(ResendMailProvider);
  });

  it("throws when mailProvider is resend but no key is present", () => {
    expect(() => createMailProvider(envWith({ mailProvider: "resend", resendApiKey: null }))).toThrow(
      /RESEND_API_KEY/,
    );
  });
});
```

- [ ] **Step 8: Run it to confirm it fails, then implement**

```ts
// artifacts/api-server/src/mail/create-mail-provider.ts
import { logger } from "../lib/logger";
import type { RequestInfoEnv } from "../lib/env";
import { ConsoleMailProvider } from "./console-mail-provider";
import { ResendMailProvider } from "./resend-mail-provider";
import type { MailProvider } from "./mail-provider";

export function createMailProvider(env: RequestInfoEnv): MailProvider {
  if (env.mailProvider === "resend") {
    if (!env.resendApiKey) {
      throw new Error('MAIL_PROVIDER is "resend" but no RESEND_API_KEY was provided.');
    }
    return new ResendMailProvider(env.resendApiKey, env.mailFromEmail, env.mailFromName);
  }
  return new ConsoleMailProvider(logger);
}
```

- [ ] **Step 9: Run both new test files to confirm they pass**

```bash
pnpm --filter @workspace/api-server run test -- console-mail-provider.test.ts create-mail-provider.test.ts
```

Expected: PASS (4 tests total).

- [ ] **Step 10: Commit**

```bash
git add artifacts/api-server/package.json artifacts/api-server/src/mail pnpm-lock.yaml
git commit -m "Add a provider-isolated MailProvider (console for dev, Resend for production)"
```

---

### Task 10: Email templates

**Files:**
- Create: `artifacts/api-server/src/mail/templates/otp-email.ts`
- Create: `artifacts/api-server/src/mail/templates/documents-email.ts`
- Test: `artifacts/api-server/src/mail/templates/otp-email.test.ts`
- Test: `artifacts/api-server/src/mail/templates/documents-email.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// artifacts/api-server/src/mail/templates/otp-email.test.ts
import { describe, expect, it } from "vitest";
import { renderOtpEmailHtml, renderOtpEmailText } from "./otp-email";

const input = { code: "384271", ttlMinutes: 10, publicSiteUrl: "https://dcl-consulting-group.com" };

describe("otp email template", () => {
  it("html includes the code and expiry", () => {
    const html = renderOtpEmailHtml(input);
    expect(html).toContain("384271");
    expect(html).toContain("10 minutes");
    expect(html).toContain("dcl-consulting-group.com");
  });

  it("text version includes the same essentials", () => {
    const text = renderOtpEmailText(input);
    expect(text).toContain("384271");
    expect(text).toContain("10 minutes");
  });

  it("does not invent an email address, phone number, or office hours", () => {
    const html = renderOtpEmailHtml(input).toLowerCase();
    expect(html).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/);
    expect(html).not.toContain("office hours");
  });

  it("never mentions attachments (the OTP email must not carry PDFs)", () => {
    const html = renderOtpEmailHtml(input).toLowerCase();
    expect(html).not.toContain("attach");
  });
});
```

```ts
// artifacts/api-server/src/mail/templates/documents-email.test.ts
import { describe, expect, it } from "vitest";
import { renderDocumentsEmailHtml, renderDocumentsEmailText } from "./documents-email";

const input = { publicSiteUrl: "https://dcl-consulting-group.com" };

describe("documents email template", () => {
  it("html includes the verified-delivery badge and company name", () => {
    const html = renderDocumentsEmailHtml(input);
    expect(html).toContain("Verified Delivery");
    expect(html).toContain("DCL Consulting and Investments Limited");
  });

  it("text version carries the same core copy", () => {
    const text = renderDocumentsEmailText(input);
    expect(text).toContain("Your requested documents");
    expect(text).toContain("DCL Consulting and Investments Limited");
  });

  it("does not invent an email address, phone number, or office hours", () => {
    const html = renderDocumentsEmailHtml(input).toLowerCase();
    expect(html).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/);
    expect(html).not.toContain("office hours");
  });
});
```

- [ ] **Step 2: Run them to confirm they fail**

```bash
pnpm --filter @workspace/api-server run test -- otp-email.test.ts documents-email.test.ts
```

Expected: FAIL — neither template file exists yet.

- [ ] **Step 3: Implement the OTP email template**

```ts
// artifacts/api-server/src/mail/templates/otp-email.ts
export interface OtpEmailInput {
  code: string;
  ttlMinutes: number;
  publicSiteUrl: string;
}

const BLUE = "#8bbfe8";
const INK = "#080a0d";
const MUTED = "#9ca3aa";

export function renderOtpEmailHtml({ code, ttlMinutes, publicSiteUrl }: OtpEmailInput): string {
  const logoUrl = `${publicSiteUrl}/images/brand/dcl-logo.png`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your DCL verification code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f4f6;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#f2f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Use this code to securely access the requested DCL documents.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${INK};max-width:600px;width:100%;">
            <tr>
              <td style="padding:32px 40px 24px;">
                <img src="${logoUrl}" alt="DCL Consulting and Investments Limited" height="28" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;">
                <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${BLUE};">Secure Document Access</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;">
                <p style="margin:0;font-size:15px;line-height:22px;color:#ffffff;">Your verification code</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;">
                <div style="background-color:#171714;border:1px solid ${BLUE};padding:20px;text-align:center;">
                  <span style="font-size:32px;letter-spacing:10px;font-weight:bold;color:#ffffff;">${code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;">
                <p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};">This code will expire in ${ttlMinutes} minutes.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px;">
                <p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};">If you did not request documents from DCL, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #2a2a26;">
                <p style="margin:0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">DCL Consulting and Investments Limited</p>
                <p style="margin:4px 0 0;font-size:12px;color:${MUTED};">dcl-consulting-group.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOtpEmailText({ code, ttlMinutes }: OtpEmailInput): string {
  return [
    "DCL Consulting and Investments Limited",
    "",
    "SECURE DOCUMENT ACCESS",
    "",
    "Your verification code:",
    code,
    "",
    `This code will expire in ${ttlMinutes} minutes.`,
    "",
    "If you did not request documents from DCL, you can safely ignore this email.",
    "",
    "dcl-consulting-group.com",
  ].join("\n");
}
```

- [ ] **Step 4: Implement the documents email template**

```ts
// artifacts/api-server/src/mail/templates/documents-email.ts
export interface DocumentsEmailInput {
  publicSiteUrl: string;
}

const BLUE = "#8bbfe8";
const INK = "#080a0d";
const MUTED = "#9ca3aa";

export function renderDocumentsEmailHtml({ publicSiteUrl }: DocumentsEmailInput): string {
  const logoUrl = `${publicSiteUrl}/images/brand/dcl-logo.png`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your requested DCL documents</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f4f6;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#f2f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Your requested DCL documents are attached to this email.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;border:1px solid #e3e6e8;">
            <tr>
              <td style="padding:32px 40px 24px;background-color:${INK};">
                <img src="${logoUrl}" alt="DCL Consulting and Investments Limited" height="28" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 0;">
                <span style="display:inline-block;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${INK};border:1px solid ${BLUE};padding:6px 12px;">Verified Delivery</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 0;">
                <p style="margin:0;font-size:24px;line-height:30px;color:${INK};font-weight:bold;">Your requested documents</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 0;">
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Dear Recipient,</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Thank you for verifying your email address.</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Please find the requested DCL documents attached to this email.</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">If you have any questions or would like to discuss how DCL may support your objectives, we would be pleased to hear from you.</p>
                <p style="margin:0;font-size:15px;line-height:24px;color:${INK};">Kind regards,<br />DCL Consulting and Investments Limited</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 24px;border-top:1px solid #e3e6e8;">
                <p style="margin:0;font-size:12px;line-height:18px;color:${MUTED};">This email was sent following a verified document request through dcl-consulting-group.com.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderDocumentsEmailText(_input: DocumentsEmailInput): string {
  return [
    "DCL Consulting and Investments Limited",
    "",
    "VERIFIED DELIVERY",
    "",
    "Your requested documents",
    "",
    "Dear Recipient,",
    "",
    "Thank you for verifying your email address.",
    "",
    "Please find the requested DCL documents attached to this email.",
    "",
    "If you have any questions or would like to discuss how DCL may support your objectives, we would be pleased to hear from you.",
    "",
    "Kind regards,",
    "DCL Consulting and Investments Limited",
    "",
    "This email was sent following a verified document request through dcl-consulting-group.com.",
  ].join("\n");
}
```

- [ ] **Step 5: Run both test files to confirm they pass**

```bash
pnpm --filter @workspace/api-server run test -- otp-email.test.ts documents-email.test.ts
```

Expected: PASS (7 tests total).

- [ ] **Step 6: Commit**

```bash
git add artifacts/api-server/src/mail/templates
git commit -m "Add branded HTML/text email templates for OTP and document delivery"
```

---

### Task 11: Rate limiting middleware

**Files:**
- Modify: `artifacts/api-server/package.json` (add `express-rate-limit`)
- Create: `artifacts/api-server/src/middlewares/request-info-rate-limit.ts`

- [ ] **Step 1: Add the dependency**

In `artifacts/api-server/package.json`, add to `"dependencies"`:

```json
    "express-rate-limit": "^7.4.1",
```

```bash
pnpm install
```

- [ ] **Step 2: Implement**

```ts
// artifacts/api-server/src/middlewares/request-info-rate-limit.ts
import rateLimit from "express-rate-limit";
import type { Request } from "express";

function emailKey(req: Request): string {
  const email = (req.body as { email?: unknown })?.email;
  return typeof email === "string" ? `email:${email.trim().toLowerCase()}` : "email:unknown";
}

/** Max 5 OTP sends per email per hour (covers both /start and /resend abuse). */
export const requestInfoSendLimiterByEmail = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  message: { error: "rate_limited" },
});

/** Max 20 OTP-related requests per IP per hour, across start/resend. */
export const requestInfoSendLimiterByIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited" },
});

/**
 * Defense-in-depth against scripted verify enumeration across many
 * different challenge ids from one IP. The meaningful per-challenge limit
 * (5 wrong attempts) is enforced in the route handler against the store,
 * not here.
 */
export const requestInfoVerifyLimiterByIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited" },
});
```

This middleware is exercised by the route integration tests in Task 12 (rate limiting is fundamentally an HTTP-layer concern, so it's tested through real requests rather than in isolation).

- [ ] **Step 3: Commit**

```bash
git add artifacts/api-server/package.json artifacts/api-server/src/middlewares pnpm-lock.yaml
git commit -m "Add rate limiting for the request-info OTP endpoints"
```

---

### Task 12: The three routes, wired together

This is the core orchestration task. The router is built via a factory
function that takes its dependencies as arguments, so tests can inject a
temp-file store and a fake mail provider instead of hitting real infra.

**Files:**
- Create: `artifacts/api-server/src/routes/request-info.ts`
- Modify: `artifacts/api-server/src/routes/index.ts`
- Test: `artifacts/api-server/src/routes/request-info.test.ts`

- [ ] **Step 1: Implement the router**

```ts
// artifacts/api-server/src/routes/request-info.ts
import { Router, type IRouter } from "express";
import type { OtpChallengeStore } from "../lib/otp-challenge-store";
import { generateOtp, hashOtp, verifyOtp } from "../lib/otp";
import type { MailProvider } from "../mail/mail-provider";
import { renderDocumentsEmailHtml, renderDocumentsEmailText } from "../mail/templates/documents-email";
import { renderOtpEmailHtml, renderOtpEmailText } from "../mail/templates/otp-email";
import { loadEnabledDocuments } from "../lib/documents";
import { logger } from "../lib/logger";
import {
  requestInfoSendLimiterByEmail,
  requestInfoSendLimiterByIp,
  requestInfoVerifyLimiterByIp,
} from "../middlewares/request-info-rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_MS = 60 * 1000;

export interface RequestInfoRouterDeps {
  store: OtpChallengeStore;
  mailProvider: MailProvider;
  otpHashSecret: string;
  otpTtlMinutes: number;
  maxAttempts: number;
  publicSiteUrl: string;
  /** Overridable only for tests; production always gets the 60s default (see below). */
  resendCooldownMs?: number;
}

const MAX_TOTAL_ATTACHMENT_BYTES = 35 * 1024 * 1024; // conservative margin under Resend's documented limit

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) return null;
  if (!EMAIL_PATTERN.test(trimmed)) return null;
  return trimmed;
}

interface DeliverableChallenge {
  id: string;
  email: string;
  deliveryStatus: string;
}

async function deliverDocuments(deps: RequestInfoRouterDeps, challenge: DeliverableChallenge): Promise<"sent" | "failed"> {
  if (challenge.deliveryStatus === "sent") return "sent";

  await deps.store.setDeliveryStatus(challenge.id, "sending");
  logger.info({ requestId: challenge.id }, "Document delivery started");

  try {
    const documents = await loadEnabledDocuments();

    const totalBytes = documents.reduce((sum, doc) => sum + doc.content.byteLength, 0);
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      await deps.store.setDeliveryStatus(challenge.id, "failed");
      logger.error(
        { requestId: challenge.id, totalBytes },
        "Document delivery failed: total attachment size exceeds the configured maximum",
      );
      return "failed";
    }

    await deps.mailProvider.sendMail({
      to: challenge.email,
      subject: "Your requested DCL documents",
      html: renderDocumentsEmailHtml({ publicSiteUrl: deps.publicSiteUrl }),
      text: renderDocumentsEmailText({ publicSiteUrl: deps.publicSiteUrl }),
      attachments: documents.map((doc) => ({ filename: doc.filename, content: doc.content })),
    });
    await deps.store.setDeliveryStatus(challenge.id, "sent");
    logger.info({ requestId: challenge.id }, "Document delivery succeeded");
    return "sent";
  } catch {
    await deps.store.setDeliveryStatus(challenge.id, "failed");
    logger.error({ requestId: challenge.id }, "Document delivery failed");
    return "failed";
  }
}

export function createRequestInfoRouter(deps: RequestInfoRouterDeps): IRouter {
  const router: IRouter = Router();

  // Read live from `deps` on every call (not captured once at router
  // creation) so tests can mutate `deps.otpTtlMinutes` after the router is
  // built and have it take effect on the next request - the same pattern
  // already used for `deps.maxAttempts` below.
  function ttlMs(): number {
    return deps.otpTtlMinutes * 60 * 1000;
  }

  router.post("/request-info/start", requestInfoSendLimiterByEmail, requestInfoSendLimiterByIp, async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }

    const code = generateOtp();
    const otpHash = hashOtp(code, deps.otpHashSecret);
    const challenge = await deps.store.create(email, otpHash, ttlMs());

    try {
      await deps.mailProvider.sendMail({
        to: email,
        subject: "Your DCL verification code",
        html: renderOtpEmailHtml({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
        text: renderOtpEmailText({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
      });
    } catch {
      logger.error({ requestId: challenge.id }, "Failed to send OTP email");
      res.status(500).json({ error: "mail_failure" });
      return;
    }

    logger.info({ requestId: challenge.id }, "OTP challenge created and code sent");
    res.json({ requestId: challenge.id });
  });

  router.post("/request-info/resend", requestInfoSendLimiterByIp, async (req, res) => {
    const requestId = req.body?.requestId;
    if (typeof requestId !== "string") {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const challenge = await deps.store.getById(requestId);
    if (!challenge || challenge.verified || Date.now() > challenge.expiresAt) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const cooldownMs = deps.resendCooldownMs ?? RESEND_COOLDOWN_MS;
    if (Date.now() - challenge.lastSentAt < cooldownMs) {
      res.status(429).json({ error: "rate_limited" });
      return;
    }

    const code = generateOtp();
    const otpHash = hashOtp(code, deps.otpHashSecret);
    const updated = await deps.store.replaceOtp(requestId, otpHash, ttlMs());

    try {
      await deps.mailProvider.sendMail({
        to: updated.email,
        subject: "Your DCL verification code",
        html: renderOtpEmailHtml({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
        text: renderOtpEmailText({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
      });
    } catch {
      logger.error({ requestId }, "Failed to send resent OTP email");
      res.status(500).json({ error: "mail_failure" });
      return;
    }

    logger.info({ requestId }, "OTP resent");
    res.json({ requestId });
  });

  router.post("/request-info/verify", requestInfoVerifyLimiterByIp, async (req, res) => {
    const requestId = req.body?.requestId;
    const code = req.body?.code;

    if (typeof requestId !== "string" || typeof code !== "string") {
      res.status(400).json({ error: "not_found" });
      return;
    }

    const challenge = await deps.store.getById(requestId);
    if (!challenge) {
      res.status(400).json({ error: "not_found" });
      return;
    }

    if (challenge.verified) {
      // Already verified: retry delivery idempotently instead of
      // re-checking the code (supports the frontend's "Try Again" button
      // after a delivery failure without asking the visitor to re-enter it).
      const status = await deliverDocuments(deps, challenge);
      res.json({ status });
      return;
    }

    if (Date.now() > challenge.expiresAt) {
      res.status(400).json({ error: "expired" });
      return;
    }

    if (challenge.attemptCount >= deps.maxAttempts) {
      await deps.store.invalidate(challenge.id);
      res.status(400).json({ error: "too_many_attempts" });
      return;
    }

    const isValid = verifyOtp(code, challenge.otpHash, deps.otpHashSecret);
    if (!isValid) {
      const updated = await deps.store.incrementAttempts(challenge.id);
      if (updated.attemptCount >= deps.maxAttempts) {
        await deps.store.invalidate(challenge.id);
        res.status(400).json({ error: "too_many_attempts" });
        return;
      }
      res.status(400).json({ error: "invalid_code" });
      return;
    }

    const verified = await deps.store.markVerified(challenge.id);
    logger.info({ requestId: challenge.id }, "OTP verified");

    const status = await deliverDocuments(deps, verified);
    res.json({ status });
  });

  return router;
}
```

- [ ] **Step 2: Write the route tests (this is the big one - covers the full matrix from the spec)**

```ts
// artifacts/api-server/src/routes/request-info.test.ts
import express from "express";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRequestInfoRouter, type RequestInfoRouterDeps } from "./request-info";
import { FileOtpChallengeStore } from "../lib/otp-challenge-store";
import type { MailProvider, SendMailInput } from "../mail/mail-provider";

class RecordingMailProvider implements MailProvider {
  sent: SendMailInput[] = [];
  async sendMail(input: SendMailInput): Promise<void> {
    this.sent.push(input);
  }
}

function extractCode(html: string): string {
  const match = html.match(/letter-spacing:10px;font-weight:bold;color:#ffffff;">(\d{6})</);
  if (!match) throw new Error("Could not find a 6-digit code in the test email HTML");
  return match[1];
}

let dir: string;
let mailProvider: RecordingMailProvider;
let deps: RequestInfoRouterDeps;
let app: express.Express;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "request-info-route-test-"));
  mailProvider = new RecordingMailProvider();
  deps = {
    store: new FileOtpChallengeStore(path.join(dir, "challenges.json")),
    mailProvider,
    otpHashSecret: "test-secret",
    otpTtlMinutes: 10,
    maxAttempts: 5,
    publicSiteUrl: "https://dcl-consulting-group.com",
  };
  app = express();
  app.use(express.json());
  app.use("/api", createRequestInfoRouter(deps));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("POST /api/request-info/start", () => {
  it("rejects an invalid email without sending mail", async () => {
    const res = await request(app).post("/api/request-info/start").send({ email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "invalid_email" });
    expect(mailProvider.sent).toHaveLength(0);
  });

  it("normalizes the email (trim + lowercase) and sends an OTP", async () => {
    const res = await request(app).post("/api/request-info/start").send({ email: "  Visitor@Example.com  " });
    expect(res.status).toBe(200);
    expect(res.body.requestId).toEqual(expect.any(String));
    expect(mailProvider.sent).toHaveLength(1);
    expect(mailProvider.sent[0].to).toBe("visitor@example.com");
    expect(mailProvider.sent[0].subject).toBe("Your DCL verification code");
    expect(mailProvider.sent[0].attachments ?? []).toHaveLength(0);
  });

  it("never returns the email or OTP in the response body", async () => {
    const res = await request(app).post("/api/request-info/start").send({ email: "visitor@example.com" });
    expect(JSON.stringify(res.body)).not.toContain("visitor@example.com");
    const code = extractCode(mailProvider.sent[0].html);
    expect(JSON.stringify(res.body)).not.toContain(code);
  });
});

describe("POST /api/request-info/verify", () => {
  async function startChallenge(email = "visitor@example.com") {
    const res = await request(app).post("/api/request-info/start").send({ email });
    const code = extractCode(mailProvider.sent.at(-1)!.html);
    return { requestId: res.body.requestId as string, code };
  }

  it("verifies a correct code and delivers the enabled documents", async () => {
    const { requestId, code } = await startChallenge();
    const res = await request(app).post("/api/request-info/verify").send({ requestId, code });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "sent" });
    expect(mailProvider.sent).toHaveLength(2);
    expect(mailProvider.sent[1].subject).toBe("Your requested DCL documents");
  });

  it("delivers documents to the verified email, never a client-supplied one", async () => {
    const { requestId, code } = await startChallenge("visitor@example.com");
    await request(app).post("/api/request-info/verify").send({ requestId, code, email: "attacker@example.com" });
    expect(mailProvider.sent[1].to).toBe("visitor@example.com");
  });

  it("rejects an incorrect code without verifying or delivering", async () => {
    const { requestId } = await startChallenge();
    const res = await request(app).post("/api/request-info/verify").send({ requestId, code: "000000" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "invalid_code" });
    expect(mailProvider.sent).toHaveLength(1);
  });

  it("rejects an expired code", async () => {
    deps.otpTtlMinutes = -1; // forces an already-past expiresAt
    const { requestId, code } = await startChallenge();
    const res = await request(app).post("/api/request-info/verify").send({ requestId, code });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "expired" });
  });

  it("invalidates the challenge after the maximum number of wrong attempts", async () => {
    deps.maxAttempts = 2;
    const { requestId } = await startChallenge();
    await request(app).post("/api/request-info/verify").send({ requestId, code: "000000" });
    const res = await request(app).post("/api/request-info/verify").send({ requestId, code: "000000" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "too_many_attempts" });

    const followUp = await request(app).post("/api/request-info/verify").send({ requestId, code: "000000" });
    expect(followUp.body).toEqual({ error: "not_found" });
  });

  it("is idempotent: a second verify call for an already-sent challenge does not resend documents", async () => {
    const { requestId, code } = await startChallenge();
    await request(app).post("/api/request-info/verify").send({ requestId, code });
    const second = await request(app).post("/api/request-info/verify").send({ requestId, code });
    expect(second.body).toEqual({ status: "sent" });
    expect(mailProvider.sent).toHaveLength(2); // OTP + one documents email, not two
  });

  it("only attaches enabled documents", async () => {
    const { requestId, code } = await startChallenge();
    await request(app).post("/api/request-info/verify").send({ requestId, code });
    const attachmentNames = mailProvider.sent[1].attachments?.map((a) => a.filename) ?? [];
    expect(attachmentNames).toContain("DCL-Company-Profile.pdf");
    expect(attachmentNames).toContain("DCL-Services-Overview.pdf");
  });

  it("retries delivery on a subsequent verify call after a delivery failure, without re-checking the code", async () => {
    const failingProvider: MailProvider = {
      sendMail: vi
        .fn()
        .mockResolvedValueOnce(undefined) // OTP email succeeds
        .mockRejectedValueOnce(new Error("mail down")) // first delivery attempt fails
        .mockResolvedValueOnce(undefined), // retry succeeds
    };
    deps.mailProvider = failingProvider;
    app = express();
    app.use(express.json());
    app.use("/api", createRequestInfoRouter(deps));

    const startRes = await request(app).post("/api/request-info/start").send({ email: "visitor@example.com" });
    const html = (failingProvider.sendMail as ReturnType<typeof vi.fn>).mock.calls[0][0].html as string;
    const code = extractCode(html);
    const requestId = startRes.body.requestId as string;

    const first = await request(app).post("/api/request-info/verify").send({ requestId, code });
    expect(first.body).toEqual({ status: "failed" });

    const retry = await request(app).post("/api/request-info/verify").send({ requestId, code });
    expect(retry.body).toEqual({ status: "sent" });
  });
});

describe("POST /api/request-info/resend", () => {
  it("invalidates the old code and sends a new one", async () => {
    deps.resendCooldownMs = 0; // isolate this test from the cooldown, which has its own test below
    app = express();
    app.use(express.json());
    app.use("/api", createRequestInfoRouter(deps));

    const startRes = await request(app).post("/api/request-info/start").send({ email: "visitor@example.com" });
    const requestId = startRes.body.requestId as string;
    const oldCode = extractCode(mailProvider.sent[0].html);

    const resendRes = await request(app).post("/api/request-info/resend").send({ requestId });
    expect(resendRes.status).toBe(200);
    const newCode = extractCode(mailProvider.sent.at(-1)!.html);
    expect(newCode).not.toBe(oldCode);

    const rejected = await request(app).post("/api/request-info/verify").send({ requestId, code: oldCode });
    expect(rejected.body).toEqual({ error: "invalid_code" });

    const accepted = await request(app).post("/api/request-info/verify").send({ requestId, code: newCode });
    expect(accepted.body).toEqual({ status: "sent" });
  });

  it("enforces the resend cooldown", async () => {
    const startRes = await request(app).post("/api/request-info/start").send({ email: "visitor@example.com" });
    const requestId = startRes.body.requestId as string;
    const res = await request(app).post("/api/request-info/resend").send({ requestId });
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: "rate_limited" });
  });

  it("returns not_found for an unknown request id", async () => {
    const res = await request(app).post("/api/request-info/resend").send({ requestId: "does-not-exist" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "not_found" });
  });
});
```

- [ ] **Step 3: Run the test file to confirm it fails, then passes after Step 1's implementation**

```bash
pnpm --filter @workspace/api-server run test -- request-info.test.ts
```

Expected: PASS (14 tests). If the resend timing test is flaky, fix it per the note above before moving on - do not skip it.

- [ ] **Step 4: Wire the router into the app with real composed dependencies**

```ts
// artifacts/api-server/src/routes/index.ts
import path from "node:path";
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { createRequestInfoRouter } from "./request-info";
import { FileOtpChallengeStore } from "../lib/otp-challenge-store";
import { createMailProvider } from "../mail/create-mail-provider";
import { loadRequestInfoEnv } from "../lib/env";

const router: IRouter = Router();

router.use(healthRouter);

const requestInfoEnv = loadRequestInfoEnv();
const requestInfoStore = new FileOtpChallengeStore(
  path.resolve(import.meta.dirname, "..", "..", ".data", "request-info-challenges.json"),
);

router.use(
  createRequestInfoRouter({
    store: requestInfoStore,
    mailProvider: createMailProvider(requestInfoEnv),
    otpHashSecret: requestInfoEnv.otpHashSecret,
    otpTtlMinutes: requestInfoEnv.otpTtlMinutes,
    maxAttempts: requestInfoEnv.maxAttempts,
    publicSiteUrl: requestInfoEnv.publicSiteUrl,
  }),
);

export default router;
```

- [ ] **Step 5: Tighten the global JSON body size limit**

Every current and planned payload on this API is tiny (an email address, or
a request id + 6-digit code). `express.json()` defaults to a 100kb limit,
which is generous for a public, unauthenticated endpoint. Lower it in
`artifacts/api-server/src/app.ts`:

```ts
app.use(express.json({ limit: "15kb" }));
```

(This replaces the existing `app.use(express.json());` line - same
position, just with the option added.)

- [ ] **Step 6: Typecheck and run the full api-server test suite**

```bash
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run test
```

Expected: both succeed with no errors.

- [ ] **Step 7: Commit**

```bash
git add artifacts/api-server/src/routes artifacts/api-server/src/app.ts
git commit -m "Add the request-info OTP endpoints (start/resend/verify) with document delivery"
```

---

### Task 13: Local dev proxy so the frontend can reach the API

**Files:**
- Modify: `artifacts/dcl-consulting/vite.config.ts`

- [ ] **Step 1: Add a proxy for `/api`**

In the `server` block, add a `proxy` entry (leave everything else in that block unchanged):

```ts
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
```

In production, `/api` is routed to the api-server by Replit's own deployment router (per `artifacts/api-server/.replit-artifact/artifact.toml`), so this proxy only matters for local `pnpm --filter @workspace/dcl-consulting run dev`.

- [ ] **Step 2: Verify the dev server still starts**

```bash
cd artifacts/dcl-consulting
MSYS_NO_PATHCONV=1 PORT=5199 BASE_PATH=/ pnpm run dev
```

Expected: starts with no errors (no need to keep it running - stop it after confirming).

- [ ] **Step 3: Commit**

```bash
git add artifacts/dcl-consulting/vite.config.ts
git commit -m "Proxy /api to the local api-server in dev"
```

---

### Task 14: `OtpCodeInput` component

**Files:**
- Create: `artifacts/dcl-consulting/src/components/contact/OtpCodeInput.tsx`
- Test: `artifacts/dcl-consulting/src/components/contact/OtpCodeInput.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// artifacts/dcl-consulting/src/components/contact/OtpCodeInput.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { OtpCodeInput } from './OtpCodeInput';

function Controlled() {
  const [value, setValue] = useState('');
  return <OtpCodeInput value={value} onChange={setValue} />;
}

describe('OtpCodeInput', () => {
  it('renders six digit cells', () => {
    render(<Controlled />);
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`otp-digit-${i}`)).toBeInTheDocument();
    }
  });

  it('auto-advances focus after typing a digit', () => {
    render(<Controlled />);
    fireEvent.change(screen.getByTestId('otp-digit-0'), { target: { value: '3' } });
    expect(screen.getByTestId('otp-digit-1')).toHaveFocus();
  });

  it('moves focus back on backspace from an empty cell', () => {
    render(<Controlled />);
    const first = screen.getByTestId('otp-digit-0');
    const second = screen.getByTestId('otp-digit-1');
    fireEvent.change(first, { target: { value: '3' } });
    (second as HTMLInputElement).focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(first).toHaveFocus();
  });

  it('fills every cell when the full code is pasted', () => {
    render(<Controlled />);
    fireEvent.paste(screen.getByTestId('otp-digit-0'), { clipboardData: { getData: () => '384271' } });
    for (const [index, digit] of ['3', '8', '4', '2', '7', '1'].entries()) {
      expect(screen.getByTestId(`otp-digit-${index}`)).toHaveValue(digit);
    }
  });

  it('only accepts numeric input', () => {
    render(<Controlled />);
    const first = screen.getByTestId('otp-digit-0');
    fireEvent.change(first, { target: { value: 'a' } });
    expect(first).toHaveValue('');
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/OtpCodeInput.test.tsx
```

Expected: FAIL — the component doesn't exist yet.

- [ ] **Step 3: Implement**

```tsx
// artifacts/dcl-consulting/src/components/contact/OtpCodeInput.tsx
import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

interface OtpCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpCodeInput({ length = 6, value, onChange, disabled = false }: OtpCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted.slice(0, length));
    const lastFilled = Math.min(pasted.length, length) - 1;
    inputRefs.current[Math.max(lastFilled, 0)]?.focus();
  }

  return (
    <div className="flex gap-2 sm:gap-3" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          data-testid={`otp-digit-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="h-14 w-11 shrink-0 border border-[#080a0d]/20 bg-white text-center text-[20px] font-semibold text-[#080a0d] outline-none transition-colors duration-200 focus-visible:border-[#8bbfe8] focus-visible:ring-2 focus-visible:ring-[#8bbfe8] disabled:opacity-50 sm:h-16 sm:w-12"
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/OtpCodeInput.test.tsx
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add artifacts/dcl-consulting/src/components/contact/OtpCodeInput.tsx artifacts/dcl-consulting/src/components/contact/OtpCodeInput.test.tsx
git commit -m "Add the six-cell OTP code input component"
```

---

### Task 15: `RequestInfoModal` component

Before writing this task, confirm the exact generated hook names from Task 3
Step 5 (`grep -n "^export function use" lib/api-client-react/src/generated/api.ts`).
The code below assumes `useStartRequestInfo`, `useResendRequestInfoCode`, and
`useVerifyRequestInfoCode` — adjust the import if Orval named them
differently.

**Files:**
- Create: `artifacts/dcl-consulting/src/components/contact/RequestInfoModal.tsx`
- Test: `artifacts/dcl-consulting/src/components/contact/RequestInfoModal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// artifacts/dcl-consulting/src/components/contact/RequestInfoModal.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequestInfoModal } from './RequestInfoModal';

const mutateStart = vi.fn();
const mutateResend = vi.fn();
const mutateVerify = vi.fn();

vi.mock('@workspace/api-client-react', () => ({
  useStartRequestInfo: () => ({ mutateAsync: mutateStart }),
  useResendRequestInfoCode: () => ({ mutateAsync: mutateResend }),
  useVerifyRequestInfoCode: () => ({ mutateAsync: mutateVerify }),
}));

function fillOtp(digits: string) {
  for (const [index, digit] of digits.split('').entries()) {
    fireEvent.change(screen.getByTestId(`otp-digit-${index}`), { target: { value: digit } });
  }
}

describe('RequestInfoModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(<RequestInfoModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('rejects an invalid email before calling the API', () => {
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    expect(screen.getByTestId('text-request-info-email-error')).toBeInTheDocument();
    expect(mutateStart).not.toHaveBeenCalled();
  });

  it('normalizes and submits a valid email, moving to the OTP state', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: '  Visitor@Example.com ' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await waitFor(() => expect(mutateStart).toHaveBeenCalledWith({ data: { email: 'visitor@example.com' } }));
    expect(await screen.findByTestId('button-request-info-verify')).toBeInTheDocument();
  });

  it('shows the incorrect-code message and stays on the OTP screen', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockRejectedValue({ data: { error: 'invalid_code' } });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');

    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));

    expect(await screen.findByTestId('text-request-info-otp-error')).toHaveTextContent(
      'The verification code is incorrect. Please check the code and try again.',
    );
  });

  it('shows the expired-code message', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockRejectedValue({ data: { error: 'expired' } });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByTestId('text-request-info-otp-error')).toHaveTextContent(
      'This verification code has expired. Please request a new code.',
    );
  });

  it('shows the success state once verification and delivery both succeed', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockResolvedValue({ status: 'sent' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByText('Documents sent successfully')).toBeInTheDocument();
  });

  it('shows the failure state when verification succeeds but delivery fails', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockResolvedValue({ status: 'failed' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByText('We couldn’t send the documents')).toBeInTheDocument();
  });

  it('change email returns to the email state', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fireEvent.click(screen.getByTestId('button-request-info-change-email'));
    expect(screen.getByTestId('input-request-info-email')).toBeInTheDocument();
  });

  it('the resend button is disabled during the cooldown', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    expect(await screen.findByTestId('button-request-info-resend')).toBeDisabled();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<RequestInfoModal open onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/RequestInfoModal.test.tsx
```

Expected: FAIL — the component doesn't exist yet.

- [ ] **Step 3: Implement**

```tsx
// artifacts/dcl-consulting/src/components/contact/RequestInfoModal.tsx
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUpRight, Lock, X } from 'lucide-react';
import {
  useResendRequestInfoCode,
  useStartRequestInfo,
  useVerifyRequestInfoCode,
} from '@workspace/api-client-react';
import { OtpCodeInput } from './OtpCodeInput';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

type ModalState = 'email' | 'sending' | 'otp' | 'verifying' | 'success' | 'failure';

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapVerifyError(error: string | undefined): string {
  switch (error) {
    case 'invalid_code':
      return 'The verification code is incorrect. Please check the code and try again.';
    case 'expired':
      return 'This verification code has expired. Please request a new code.';
    case 'too_many_attempts':
      return 'Too many incorrect attempts. Please request a new code.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

interface RequestInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestInfoModal({ open, onClose }: RequestInfoModalProps) {
  const [state, setState] = useState<ModalState>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const startMutation = useStartRequestInfo();
  const resendMutation = useResendRequestInfoCode();
  const verifyMutation = useVerifyRequestInfoCode();

  useEffect(() => {
    if (open) {
      triggerFocusRef.current = document.activeElement as HTMLElement;
    } else {
      triggerFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(dialogRef.current, { clearProps: 'all' });
        return;
      }
      gsap.fromTo(dialogRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }, dialogRef);
    return () => ctx.revert();
  }, [open, prefersReducedMotion, state]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLElement>('input, button')?.focus();
  }, [open, state]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function resetAll() {
    setState('email');
    setEmail('');
    setEmailError(null);
    setRequestId(null);
    setCode('');
    setOtpError(null);
    setCooldown(0);
  }

  function handleClose() {
    if (state === 'sending' || state === 'verifying') return;
    resetAll();
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key === 'Tab' && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized) || normalized.length > 254) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    setState('sending');
    try {
      const result = await startMutation.mutateAsync({ data: { email: normalized } });
      setEmail(normalized);
      setRequestId(result.requestId);
      setCode('');
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setState('otp');
    } catch {
      setEmailError('We could not send a verification code. Please try again.');
      setState('email');
    }
  }

  async function handleVerifySubmit(event: FormEvent) {
    event.preventDefault();
    if (!requestId || code.length !== 6) return;
    setOtpError(null);
    setState('verifying');
    try {
      const result = await verifyMutation.mutateAsync({ data: { requestId, code } });
      setState(result.status === 'sent' ? 'success' : 'failure');
    } catch (error) {
      const apiError = (error as { data?: { error?: string } })?.data?.error;
      setOtpError(mapVerifyError(apiError));
      setState('otp');
    }
  }

  async function handleResend() {
    if (!requestId || cooldown > 0) return;
    try {
      await resendMutation.mutateAsync({ data: { requestId } });
      setCode('');
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setOtpError('We could not resend the code. Please try again shortly.');
    }
  }

  function handleChangeEmail() {
    setState('email');
    setRequestId(null);
    setCode('');
    setOtpError(null);
    setCooldown(0);
  }

  async function handleTryAgain() {
    if (!requestId) return;
    setState('verifying');
    try {
      const result = await verifyMutation.mutateAsync({ data: { requestId, code } });
      setState(result.status === 'sent' ? 'success' : 'failure');
    } catch {
      setState('failure');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080a0d]/70 px-4 py-8 backdrop-blur-[2px]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-info-heading"
        onKeyDown={handleKeyDown}
        className="relative flex max-h-[calc(100vh-32px)] w-full flex-col overflow-y-auto bg-white p-8 sm:p-10"
        style={{ width: 'min(560px, calc(100vw - 28px))' }}
      >
        <button
          type="button"
          aria-label="Close dialog"
          data-testid="button-request-info-close"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-[#080a0d]/60 outline-none transition-colors duration-200 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {(state === 'email' || state === 'sending') && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <p className="dclHome__eyebrow text-[#9ca3aa]">Secure Document Access</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
            >
              Access DCL Documents
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              Verify your email address to receive the requested DCL documents securely.
            </p>

            <label htmlFor="request-info-email" className="mt-8 block text-[11px] font-semibold uppercase tracking-[.14em] text-[#6b737a]">
              Email address
            </label>
            <div className="mt-2 flex items-center gap-2 border border-[#080a0d]/20 px-4 py-3 focus-within:border-[#8bbfe8]">
              <Lock size={15} strokeWidth={1.4} className="shrink-0 text-[#8bbfe8]" aria-hidden="true" />
              <input
                id="request-info-email"
                data-testid="input-request-info-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                disabled={state === 'sending'}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full text-[16px] text-[#080a0d] outline-none placeholder:text-[#9ca3aa]"
              />
            </div>
            {emailError && (
              <p data-testid="text-request-info-email-error" className="mt-2 text-[13px] text-[#a13b3b]">
                {emailError}
              </p>
            )}

            <button
              type="submit"
              data-testid="button-request-info-send"
              disabled={state === 'sending'}
              className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] disabled:opacity-60"
            >
              {state === 'sending' ? 'Sending Code…' : 'Send Verification Code'}
              {state !== 'sending' && (
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              )}
            </button>

            <p className="mt-5 text-[12px] leading-5 text-[#9ca3aa]">
              Your email address is used only to verify your request and deliver the requested documents.
            </p>
          </form>
        )}

        {(state === 'otp' || state === 'verifying') && (
          <form onSubmit={handleVerifySubmit} noValidate>
            <p className="dclHome__eyebrow text-[#9ca3aa]">Email Verification</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
            >
              Enter your verification code
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              We sent a six-digit verification code to:
              <br />
              <span className="font-medium text-[#080a0d]">{email}</span>
            </p>

            <div className="mt-6">
              <OtpCodeInput value={code} onChange={setCode} disabled={state === 'verifying'} />
            </div>

            {otpError && (
              <p data-testid="text-request-info-otp-error" className="mt-3 text-[13px] text-[#a13b3b]">
                {otpError}
              </p>
            )}

            <p className="mt-5 text-[13px] leading-5 text-[#6b737a]">
              <span className="font-medium text-[#080a0d]">Code not visible yet?</span> Check your inbox first, then your
              spam, junk or promotions folder. Delivery may take a minute.
            </p>

            <button
              type="submit"
              data-testid="button-request-info-verify"
              disabled={state === 'verifying' || code.length !== 6}
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] disabled:opacity-60"
            >
              {state === 'verifying' ? 'Verifying…' : 'Verify and Send Documents'}
              {state !== 'verifying' && (
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              )}
            </button>

            <div className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.12em]">
              <button
                type="button"
                data-testid="button-request-info-change-email"
                onClick={handleChangeEmail}
                className="text-[#080a0d]/60 underline-offset-4 hover:underline"
              >
                Change Email
              </button>
              <button
                type="button"
                data-testid="button-request-info-resend"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-[#080a0d] disabled:text-[#9ca3aa]"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {state === 'success' && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8bbfe8]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="#8bbfe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="dclHome__eyebrow mt-6 text-center text-[#9ca3aa]">Verification Complete</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-center text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
            >
              Documents sent successfully
            </h2>
            <p className="mt-4 text-center text-[15px] leading-6 text-[#35404a]">
              The requested documents have been sent to your verified email address.
            </p>
            <p className="mt-3 text-center text-[13px] leading-5 text-[#6b737a]">
              Please check your inbox first. If the email is not visible, review your spam, junk or promotions folder.
            </p>
            <button
              type="button"
              data-testid="button-request-info-close-success"
              onClick={handleClose}
              className="mt-8 inline-flex w-full items-center justify-center bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Close Window
            </button>
            <p className="mt-5 text-center text-[12px] leading-5 text-[#9ca3aa]">
              Your email address is used only to securely deliver the requested documents.
            </p>
          </div>
        )}

        {state === 'failure' && (
          <div>
            <h2
              id="request-info-heading"
              className="dclHome__display text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
            >
              We couldn’t send the documents
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              Your email was verified successfully, but we were unable to complete document delivery. Please try again or
              contact DCL.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                data-testid="button-request-info-try-again"
                onClick={handleTryAgain}
                className="inline-flex flex-1 items-center justify-center bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                Try Again
              </button>
              <a
                href="#how-can-we-help"
                onClick={handleClose}
                className="inline-flex flex-1 items-center justify-center border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:text-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                Contact DCL
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/RequestInfoModal.test.tsx
```

Expected: PASS (10 tests). If a hook name doesn't match the generated file, fix the import and re-run.

- [ ] **Step 5: Commit**

```bash
git add artifacts/dcl-consulting/src/components/contact/RequestInfoModal.tsx artifacts/dcl-consulting/src/components/contact/RequestInfoModal.test.tsx
git commit -m "Add the RequestInfoModal state machine (email, OTP, success, failure)"
```

---

### Task 16: Wire the trigger into `CompanyInformation`

**Files:**
- Modify: `artifacts/dcl-consulting/src/components/contact/CompanyInformation.tsx`
- Modify: `artifacts/dcl-consulting/src/components/contact/CompanyInformation.test.tsx`

- [ ] **Step 1: Add the mock to the existing test file's top (needed because CompanyInformation now renders RequestInfoModal, which calls the generated hooks)**

At the top of `CompanyInformation.test.tsx`, before the existing `describe` block, add:

```tsx
vi.mock('@workspace/api-client-react', () => ({
  useStartRequestInfo: () => ({ mutateAsync: vi.fn() }),
  useResendRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
  useVerifyRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
}));
```

(Add `vi` to the existing `import { ... } from 'vitest'` line if it isn't already imported.)

- [ ] **Step 2: Write the new failing test**

Add to the existing `describe('CompanyInformation', ...)` block:

```tsx
  it('opens the request-more-info modal when the trigger is clicked', () => {
    render(<CompanyInformation />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('button-request-more-info'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
```

(Add `fireEvent` to the existing `@testing-library/react` import if it isn't already there.)

- [ ] **Step 3: Run it to confirm it fails**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/CompanyInformation.test.tsx
```

Expected: FAIL — no `button-request-more-info` testid exists yet.

- [ ] **Step 4: Implement**

Add the import and local state near the top of `CompanyInformation.tsx`:

```tsx
import { useState } from 'react';
import { RequestInfoModal } from './RequestInfoModal';
```

Inside the `CompanyInformation` function, add:

```tsx
  const [isRequestInfoOpen, setRequestInfoOpen] = useState(false);
```

Add the trigger button right after the existing primary/secondary CTA `<div>` in the left column (before the statement/vertical-rule block):

```tsx
            <button
              type="button"
              data-testid="button-request-more-info"
              onClick={() => setRequestInfoOpen(true)}
              className="dclCompanyInfo__fadeUp group mt-5 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#171714]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Request More Info
              <ArrowUpRight size={14} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </button>
```

Add the modal just before the closing `</section>` tag:

```tsx
      <RequestInfoModal open={isRequestInfoOpen} onClose={() => setRequestInfoOpen(false)} />
```

- [ ] **Step 5: Run the full test file to confirm everything passes**

```bash
cd artifacts/dcl-consulting
TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run src/components/contact/CompanyInformation.test.tsx
```

Expected: PASS (all tests, including the new one).

- [ ] **Step 6: Commit**

```bash
git add artifacts/dcl-consulting/src/components/contact/CompanyInformation.tsx artifacts/dcl-consulting/src/components/contact/CompanyInformation.test.tsx
git commit -m "Add the Request More Info trigger to the Company Information section"
```

---

### Task 17: Full verification

- [ ] **Step 1: Typecheck everything**

```bash
pnpm run typecheck
```

Expected: no errors across `lib/*`, `artifacts/api-server`, and `artifacts/dcl-consulting`.

- [ ] **Step 2: Run every test suite**

```bash
pnpm --filter @workspace/api-server run test
cd artifacts/dcl-consulting && TEMP="E:\\node-tmp" TMP="E:\\node-tmp" npx vitest run
```

Expected: all green, including every new test added in Tasks 2-16.

- [ ] **Step 3: Production build**

```bash
pnpm run build
```

Expected: succeeds (this also typechecks and builds `api-server` via esbuild and `dcl-consulting` via Vite).

- [ ] **Step 4: Manual smoke test (real browser, MAIL_PROVIDER=console)**

```bash
cd artifacts/api-server
OTP_HASH_SECRET=dev-secret PORT=8080 pnpm run dev
```

In another terminal:

```bash
cd artifacts/dcl-consulting
MSYS_NO_PATHCONV=1 PORT=5199 BASE_PATH=/ pnpm run dev
```

Open the site, go to `/contact`, click "Request More Info," submit a real
email you can watch the api-server's console for (the `ConsoleMailProvider`
logs the OTP there since `MAIL_PROVIDER` defaults to `console`), enter it,
and confirm the success state appears. Also test: wrong code, resend,
change email, closing and reopening, and a narrow (390px) viewport.

- [ ] **Step 5: Clean up any scratch files, then stop both dev servers.**

No commit needed for this task - it's verification only.

---

## What's still a real prerequisite, not a plan gap

- A real `RESEND_API_KEY` and verified sending domain must be added to the
  deployed environment (`MAIL_PROVIDER=resend`) before actual email leaves
  the console-logging dev mode.
- The two PDFs are placeholders built only from facts already public on the
  DCL site - swap them for real marketing collateral via the manifest and
  `private/documents/README.md` whenever they're ready.
- `OTP_HASH_SECRET` must be a real random value in every real environment
  (`openssl rand -hex 32`), generated once and kept secret - never reuse the
  `dev-secret` from the smoke test above.
