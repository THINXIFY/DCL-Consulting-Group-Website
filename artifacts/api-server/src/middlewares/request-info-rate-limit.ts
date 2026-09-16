import rateLimit, { MemoryStore } from "express-rate-limit";
import type { Request } from "express";

function emailKey(req: Request): string {
  const email = (req.body as { email?: unknown })?.email;
  return typeof email === "string" ? `email:${email.trim().toLowerCase()}` : "email:unknown";
}

// Explicit store instances (rather than letting each rateLimit() call
// create its own default MemoryStore internally) so tests can reach in and
// clear them between test cases via resetRequestInfoRateLimiters() below.
// These limiters are module-level singletons - their hit counters persist
// for the life of the process, which is the point in production, but means
// every test in the same file shares them unless explicitly reset.
const sendByEmailStore = new MemoryStore();
const sendByIpStore = new MemoryStore();
const verifyByIpStore = new MemoryStore();

/** Max 5 OTP sends per email per hour (covers both /start and /resend abuse). */
export const requestInfoSendLimiterByEmail = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  message: { error: "rate_limited" },
  store: sendByEmailStore,
});

/** Max 20 OTP-related requests per IP per hour, across start/resend. */
export const requestInfoSendLimiterByIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited" },
  store: sendByIpStore,
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
  store: verifyByIpStore,
});

/**
 * Test-only helper: clears every limiter's in-memory hit counters. Never
 * called from production code paths - these limiters are intentionally
 * long-lived singletons there. Route tests need this because, unlike
 * `deps.store`/`deps.mailProvider` (freshly constructed per test), these
 * limiter singletons are shared module state across every test in a file;
 * without resetting them, the 5-per-email and 20/30-per-IP hourly caps get
 * exhausted partway through a test file and cause order-dependent failures
 * in later, unrelated tests.
 */
export async function resetRequestInfoRateLimiters(): Promise<void> {
  await Promise.all([sendByEmailStore.resetAll(), sendByIpStore.resetAll(), verifyByIpStore.resetAll()]);
}
