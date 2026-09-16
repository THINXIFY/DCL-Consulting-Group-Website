import { afterEach, describe, expect, it } from "vitest";
import { loadRequestInfoEnv } from "./env";

// Scoped to only the keys this suite touches, and restored individually,
// rather than blanket-deleting and restoring all of process.env: Vitest's
// thread pool can run multiple test files in the same worker thread, and a
// blanket reset here could wipe or mismatch env state a sibling file relies
// on if it happens to share a worker with this one.
const ENV_KEYS = [
  "OTP_HASH_SECRET",
  "REQUEST_INFO_OTP_TTL_MINUTES",
  "REQUEST_INFO_MAX_ATTEMPTS",
  "MAIL_PROVIDER",
  "RESEND_API_KEY",
  "PUBLIC_SITE_URL",
  "NODE_ENV",
] as const;

const ORIGINAL_VALUES = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function resetEnv() {
  for (const key of ENV_KEYS) {
    const original = ORIGINAL_VALUES[key];
    if (original === undefined) delete process.env[key];
    else process.env[key] = original;
  }
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

  it("refuses to boot with MAIL_PROVIDER=console in production", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.NODE_ENV = "production";
    delete process.env.MAIL_PROVIDER; // defaults to "console"
    expect(() => loadRequestInfoEnv()).toThrow(/MAIL_PROVIDER must be explicitly set to "resend"/);
  });

  it("allows MAIL_PROVIDER=resend in production when a key is present", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.NODE_ENV = "production";
    process.env.MAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test_key";
    expect(() => loadRequestInfoEnv()).not.toThrow();
  });

  it("allows MAIL_PROVIDER=console outside production", () => {
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.NODE_ENV = "development";
    delete process.env.MAIL_PROVIDER;
    expect(loadRequestInfoEnv().mailProvider).toBe("console");
  });
});
