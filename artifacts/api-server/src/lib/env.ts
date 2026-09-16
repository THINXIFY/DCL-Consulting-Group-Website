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
