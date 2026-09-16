import path from "node:path";
import { findPackageRoot } from "./documents";

export interface RequestInfoEnv {
  otpHashSecret: string;
  otpTtlMinutes: number;
  maxAttempts: number;
  mailProvider: "resend" | "console";
  resendApiKey: string | null;
  mailFromEmail: string;
  mailFromName: string;
  publicSiteUrl: string;
  /** Directory the OTP challenge JSON file is written under (see FileOtpChallengeStore). */
  dataDir: string;
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
  // Resend rejects sends from a "from" address whose domain isn't verified
  // in the account - the silent default below ("no-reply@example.com") is
  // never a valid sender, so every real send would fail. Fail closed here
  // instead of letting a missing env var turn into a 100%-send-failure
  // production incident that only surfaces once a visitor complains.
  if (mailProvider === "resend" && !process.env.MAIL_FROM_EMAIL) {
    throw new Error('MAIL_PROVIDER is "resend" but MAIL_FROM_EMAIL is not set.');
  }
  // Fail closed, not open: MAIL_PROVIDER defaults to "console" (so local
  // dev works out of the box), but that default becoming the *production*
  // path by accident - simply forgetting to set MAIL_PROVIDER=resend in a
  // deployed environment - would silently log every real visitor's email
  // address and plaintext OTP to the server console. Refuse to boot rather
  // than let a missing env var become a silent secret-logging bug.
  if (process.env.NODE_ENV === "production" && mailProvider === "console") {
    throw new Error(
      'MAIL_PROVIDER must be explicitly set to "resend" in production - refusing to silently log real visitor emails and OTP codes to the console.',
    );
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
    // REQUEST_INFO_DATA_DIR lets a deployment point this at a mounted
    // persistent disk (e.g. Render's "/var/data") outside the app's own
    // directory. Unset (local dev, and any deploy that doesn't need to
    // override it) falls back to "<package root>/.data" - resolved by
    // walking up from wherever this code is actually running (see
    // findPackageRoot's own comment in documents.ts): a hardcoded
    // "../.." relative to this file would resolve correctly in dev, but
    // break once esbuild bundles this into dist/index.mjs, which sits at
    // a different depth than src/lib/env.ts does.
    dataDir: process.env.REQUEST_INFO_DATA_DIR ?? path.join(findPackageRoot(import.meta.dirname), ".data"),
  };
}
