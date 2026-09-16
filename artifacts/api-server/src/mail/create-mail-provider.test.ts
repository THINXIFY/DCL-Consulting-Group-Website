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
