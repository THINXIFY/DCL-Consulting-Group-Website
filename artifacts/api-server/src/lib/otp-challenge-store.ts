import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
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
 *
 * IMPORTANT: construct exactly ONE instance per file path within a process
 * (e.g. a module-level singleton, as Task 12 does) and share it across every
 * route handler. Two instances pointed at the same file each keep their own
 * independent in-memory cache, so their writes silently clobber each other -
 * `load()` never re-reads the file once cached, so a second instance has no
 * way to discover mutations the first instance already wrote.
 *
 * Correctness of concurrent same-process calls (e.g. three overlapping
 * `incrementAttempts` calls on the same id) depends on two invariants that
 * must be preserved by any future edit to this class: (1) `load()` always
 * returns the *same* cached Map/object references to every caller - never a
 * copy - so mutations are visible to all in-flight callers immediately, and
 * (2) no `await` ever appears between reading and writing a challenge's
 * field, so a read-modify-write (like `challenge.attemptCount += 1`) always
 * completes in one synchronous step with nothing else able to interleave.
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

    // Write to a temp file and rename over the real one so a crash or kill
    // mid-write never leaves a truncated/corrupt JSON file behind (rename is
    // atomic on the same filesystem, and this file always stays on one).
    const tmpPath = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;

    // Serialize writes through a promise chain so concurrent mutations in
    // this process never interleave partial file writes. `.catch(() => {})`
    // before chaining is deliberate: it stops one failed write from
    // permanently poisoning `writeQueue` for every write after it (a plain
    // `.then()` on an already-rejected promise never runs its callback -
    // without this, a single transient disk error would silently disable
    // persistence for the rest of the process's life). The failure is still
    // reported to whoever called *this* persist() via `await attempt` below;
    // only the shared queue itself is kept always-eventually-resolved.
    const attempt = this.writeQueue.catch(() => {}).then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      await writeFile(tmpPath, data, "utf8");
      await rename(tmpPath, this.filePath);
    });
    this.writeQueue = attempt.catch(() => {});
    await attempt;
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
