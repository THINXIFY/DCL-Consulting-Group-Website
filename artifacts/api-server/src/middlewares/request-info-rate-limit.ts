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
