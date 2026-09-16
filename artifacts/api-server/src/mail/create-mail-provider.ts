import { logger } from "../lib/logger";
import type { RequestInfoEnv } from "../lib/env";
import { ConsoleMailProvider } from "./console-mail-provider";
import { ResendMailProvider } from "./resend-mail-provider";
import type { MailProvider } from "./mail-provider";

export function createMailProvider(env: RequestInfoEnv): MailProvider {
  if (env.mailProvider === "resend") {
    if (!env.resendApiKey) {
      throw new Error('MAIL_PROVIDER is "resend" but no RESEND_API_KEY was provided.');
    }
    return new ResendMailProvider(env.resendApiKey, env.mailFromEmail, env.mailFromName);
  }
  return new ConsoleMailProvider(logger);
}
