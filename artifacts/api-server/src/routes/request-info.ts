import { Router, type IRouter } from "express";
import type { OtpChallengeStore } from "../lib/otp-challenge-store";
import { generateOtp, hashOtp, verifyOtp } from "../lib/otp";
import type { MailProvider } from "../mail/mail-provider";
import { renderDocumentsEmailHtml, renderDocumentsEmailText } from "../mail/templates/documents-email";
import { renderOtpEmailHtml, renderOtpEmailText } from "../mail/templates/otp-email";
import { DOCUMENTS_ROOT, loadEnabledDocuments } from "../lib/documents";
import { requestInfoDocuments, type RequestInfoDocument } from "../../config/request-info-documents";
import { logger } from "../lib/logger";
import {
  requestInfoSendLimiterByEmail,
  requestInfoSendLimiterByIp,
  requestInfoVerifyLimiterByIp,
} from "../middlewares/request-info-rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_MS = 60 * 1000;

export interface RequestInfoRouterDeps {
  store: OtpChallengeStore;
  mailProvider: MailProvider;
  otpHashSecret: string;
  otpTtlMinutes: number;
  maxAttempts: number;
  publicSiteUrl: string;
  /** Overridable only for tests; production always gets the 60s default (see below). */
  resendCooldownMs?: number;
  /** Overridable only for tests; production always reads the real manifest/root. */
  documentsManifest?: RequestInfoDocument[];
  documentsRoot?: string;
}

const MAX_TOTAL_ATTACHMENT_BYTES = 35 * 1024 * 1024; // conservative margin under Resend's documented limit

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) return null;
  if (!EMAIL_PATTERN.test(trimmed)) return null;
  return trimmed;
}

interface DeliverableChallenge {
  id: string;
  email: string;
  deliveryStatus: string;
}

async function deliverDocuments(deps: RequestInfoRouterDeps, challenge: DeliverableChallenge): Promise<"sent" | "failed"> {
  if (challenge.deliveryStatus === "sent") return "sent";

  await deps.store.setDeliveryStatus(challenge.id, "sending");
  logger.info({ requestId: challenge.id }, "Document delivery started");

  try {
    const manifest = deps.documentsManifest ?? requestInfoDocuments;
    const documentsRoot = deps.documentsRoot ?? DOCUMENTS_ROOT;
    const expectedCount = manifest.filter((doc) => doc.enabled).length;
    const documents = await loadEnabledDocuments(manifest, documentsRoot);

    // Safe to log: directory path, count, filenames and byte sizes only -
    // never file contents or anything secret.
    logger.info(
      {
        requestId: challenge.id,
        documentsRoot,
        expectedCount,
        loadedCount: documents.length,
        attachments: documents.map((doc) => ({ filename: doc.filename, bytes: doc.content.byteLength })),
      },
      "Resolved request-info document attachments",
    );

    // A manifest entry that failed to load (missing file, wrong path, bad
    // permissions) is a real delivery failure, not a "best effort, send
    // what we have" situation - a visitor must never be told documents were
    // sent when some or all of them silently weren't. This also refuses to
    // ever call the mail provider with `attachments: []`.
    if (expectedCount === 0 || documents.length !== expectedCount || documents.some((doc) => doc.content.byteLength === 0)) {
      await deps.store.setDeliveryStatus(challenge.id, "failed");
      logger.error(
        { requestId: challenge.id, documentsRoot, expectedCount, loadedCount: documents.length },
        "Document delivery failed: one or more configured documents did not load correctly",
      );
      return "failed";
    }

    const totalBytes = documents.reduce((sum, doc) => sum + doc.content.byteLength, 0);
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      await deps.store.setDeliveryStatus(challenge.id, "failed");
      logger.error(
        { requestId: challenge.id, totalBytes },
        "Document delivery failed: total attachment size exceeds the configured maximum",
      );
      return "failed";
    }

    await deps.mailProvider.sendMail({
      to: challenge.email,
      subject: "Your requested DCL documents",
      html: renderDocumentsEmailHtml({ publicSiteUrl: deps.publicSiteUrl }),
      text: renderDocumentsEmailText({ publicSiteUrl: deps.publicSiteUrl }),
      attachments: documents.map((doc) => ({ filename: doc.filename, content: doc.content, contentType: doc.contentType })),
    });
    await deps.store.setDeliveryStatus(challenge.id, "sent");
    logger.info({ requestId: challenge.id, attachmentCount: documents.length }, "Document delivery succeeded");
    return "sent";
  } catch (err) {
    await deps.store.setDeliveryStatus(challenge.id, "failed");
    logger.error({ requestId: challenge.id, err }, "Document delivery failed");
    return "failed";
  }
}

export function createRequestInfoRouter(deps: RequestInfoRouterDeps): IRouter {
  const router: IRouter = Router();

  // Read live from `deps` on every call (not captured once at router
  // creation) so tests can mutate `deps.otpTtlMinutes` after the router is
  // built and have it take effect on the next request - the same pattern
  // already used for `deps.maxAttempts` below.
  function ttlMs(): number {
    return deps.otpTtlMinutes * 60 * 1000;
  }

  router.post("/request-info/start", requestInfoSendLimiterByEmail, requestInfoSendLimiterByIp, async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }

    const code = generateOtp();
    const otpHash = hashOtp(code, deps.otpHashSecret);
    const challenge = await deps.store.create(email, otpHash, ttlMs());

    try {
      await deps.mailProvider.sendMail({
        to: email,
        subject: "Your DCL verification code",
        html: renderOtpEmailHtml({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
        text: renderOtpEmailText({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
      });
    } catch (err) {
      logger.error({ requestId: challenge.id, err }, "Failed to send OTP email");
      res.status(500).json({ error: "mail_failure" });
      return;
    }

    logger.info({ requestId: challenge.id }, "OTP challenge created and code sent");
    res.json({ requestId: challenge.id });
  });

  router.post("/request-info/resend", requestInfoSendLimiterByIp, async (req, res) => {
    const requestId = req.body?.requestId;
    if (typeof requestId !== "string") {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const challenge = await deps.store.getById(requestId);
    if (!challenge || challenge.verified || Date.now() > challenge.expiresAt) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const cooldownMs = deps.resendCooldownMs ?? RESEND_COOLDOWN_MS;
    if (Date.now() - challenge.lastSentAt < cooldownMs) {
      res.status(429).json({ error: "rate_limited" });
      return;
    }

    const code = generateOtp();
    const otpHash = hashOtp(code, deps.otpHashSecret);
    const updated = await deps.store.replaceOtp(requestId, otpHash, ttlMs());

    try {
      await deps.mailProvider.sendMail({
        to: updated.email,
        subject: "Your DCL verification code",
        html: renderOtpEmailHtml({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
        text: renderOtpEmailText({ code, ttlMinutes: deps.otpTtlMinutes, publicSiteUrl: deps.publicSiteUrl }),
      });
    } catch (err) {
      logger.error({ requestId, err }, "Failed to send resent OTP email");
      res.status(500).json({ error: "mail_failure" });
      return;
    }

    logger.info({ requestId }, "OTP resent");
    res.json({ requestId });
  });

  router.post("/request-info/verify", requestInfoVerifyLimiterByIp, async (req, res) => {
    const requestId = req.body?.requestId;
    const code = req.body?.code;

    if (typeof requestId !== "string" || typeof code !== "string") {
      res.status(400).json({ error: "not_found" });
      return;
    }

    const challenge = await deps.store.getById(requestId);
    if (!challenge) {
      res.status(400).json({ error: "not_found" });
      return;
    }

    if (challenge.verified) {
      // Already verified: retry delivery idempotently instead of
      // re-checking the code (supports the frontend's "Try Again" button
      // after a delivery failure without asking the visitor to re-enter it).
      const status = await deliverDocuments(deps, challenge);
      res.json({ status });
      return;
    }

    if (Date.now() > challenge.expiresAt) {
      res.status(400).json({ error: "expired" });
      return;
    }

    if (challenge.attemptCount >= deps.maxAttempts) {
      await deps.store.invalidate(challenge.id);
      res.status(400).json({ error: "too_many_attempts" });
      return;
    }

    const isValid = verifyOtp(code, challenge.otpHash, deps.otpHashSecret);
    if (!isValid) {
      const updated = await deps.store.incrementAttempts(challenge.id);
      if (updated.attemptCount >= deps.maxAttempts) {
        await deps.store.invalidate(challenge.id);
        res.status(400).json({ error: "too_many_attempts" });
        return;
      }
      res.status(400).json({ error: "invalid_code" });
      return;
    }

    const verified = await deps.store.markVerified(challenge.id);
    logger.info({ requestId: challenge.id }, "OTP verified");

    const status = await deliverDocuments(deps, verified);
    res.json({ status });
  });

  return router;
}
