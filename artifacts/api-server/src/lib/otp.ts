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
