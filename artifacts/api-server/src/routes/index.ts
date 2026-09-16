import path from "node:path";
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { createRequestInfoRouter } from "./request-info";
import { FileOtpChallengeStore } from "../lib/otp-challenge-store";
import { createMailProvider } from "../mail/create-mail-provider";
import { loadRequestInfoEnv } from "../lib/env";

const router: IRouter = Router();

router.use(healthRouter);

const requestInfoEnv = loadRequestInfoEnv();
const requestInfoStore = new FileOtpChallengeStore(path.join(requestInfoEnv.dataDir, "request-info-challenges.json"));

router.use(
  createRequestInfoRouter({
    store: requestInfoStore,
    mailProvider: createMailProvider(requestInfoEnv),
    otpHashSecret: requestInfoEnv.otpHashSecret,
    otpTtlMinutes: requestInfoEnv.otpTtlMinutes,
    maxAttempts: requestInfoEnv.maxAttempts,
    publicSiteUrl: requestInfoEnv.publicSiteUrl,
  }),
);

export default router;
