import type { Logger } from "pino";
import type { MailProvider, SendMailInput } from "./mail-provider";

/**
 * Local-development mail provider: logs the email instead of sending it.
 * Selected only when MAIL_PROVIDER=console (the default). This is how a
 * developer sees the OTP locally without a real Resend account - the OTP
 * is never displayed in the actual product UI, only in this server log.
 */
export class ConsoleMailProvider implements MailProvider {
  constructor(private readonly logger: Pick<Logger, "info">) {}

  async sendMail(input: SendMailInput): Promise<void> {
    this.logger.info(
      {
        to: input.to,
        subject: input.subject,
        attachmentCount: input.attachments?.length ?? 0,
      },
      `[console-mail-provider] Not actually sent (set MAIL_PROVIDER=resend for real delivery). Preview:\n${input.text}`,
    );
  }
}
