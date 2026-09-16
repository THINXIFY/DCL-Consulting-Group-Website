import express from "express";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRequestInfoRouter, type RequestInfoRouterDeps } from "./request-info";
import { FileOtpChallengeStore } from "../lib/otp-challenge-store";
import type { MailProvider, SendMailInput } from "../mail/mail-provider";
import { resetRequestInfoRateLimiters } from "../middlewares/request-info-rate-limit";

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
  // These rate limiters are module-level singletons shared across every
  // test in this file (unlike the store/mailProvider below, which are
  // freshly constructed per test) - reset them so an earlier test's
  // /start or /verify calls never count against a later test's quota.
  await resetRequestInfoRateLimiters();
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
