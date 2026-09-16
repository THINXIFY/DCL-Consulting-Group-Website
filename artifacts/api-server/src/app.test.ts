import { afterEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = ["NODE_ENV", "CORS_ALLOWED_ORIGINS", "OTP_HASH_SECRET", "MAIL_PROVIDER"] as const;
const ORIGINAL_VALUES = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function resetEnv() {
  for (const key of ENV_KEYS) {
    const original = ORIGINAL_VALUES[key];
    if (original === undefined) delete process.env[key];
    else process.env[key] = original;
  }
}

// app.ts (and the routes it imports) read env vars and construct the
// request-info router at *module load* time, so each test needs a fresh
// module instance - vi.resetModules() plus a dynamic re-import, rather
// than importing app once at the top of the file.
async function loadApp() {
  vi.resetModules();
  const mod = await import("./app");
  return mod.default;
}

describe("app CORS configuration", () => {
  afterEach(() => {
    resetEnv();
    vi.restoreAllMocks();
  });

  it("refuses to start in production without CORS_ALLOWED_ORIGINS", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.CORS_ALLOWED_ORIGINS;
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.MAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test";
    process.env.MAIL_FROM_EMAIL = "info@dcl-consulting-group.com";

    await expect(loadApp()).rejects.toThrow(/CORS_ALLOWED_ORIGINS must be set in production/);
  });

  it("boots in production once CORS_ALLOWED_ORIGINS is set", async () => {
    process.env.NODE_ENV = "production";
    process.env.CORS_ALLOWED_ORIGINS = "https://dcl-consulting-group.com";
    process.env.OTP_HASH_SECRET = "test-secret";
    process.env.MAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test";
    process.env.MAIL_FROM_EMAIL = "info@dcl-consulting-group.com";

    await expect(loadApp()).resolves.toBeDefined();
  });

  it("does not require CORS_ALLOWED_ORIGINS outside production", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.CORS_ALLOWED_ORIGINS;
    process.env.OTP_HASH_SECRET = "test-secret";
    delete process.env.MAIL_PROVIDER;

    await expect(loadApp()).resolves.toBeDefined();
  });
});
