import { Resend } from "resend";
import type { MailProvider, SendMailInput } from "./mail-provider";

export class ResendMailProvider implements MailProvider {
  private readonly client: Resend;

  constructor(
    apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string,
  ) {
    this.client = new Resend(apiKey);
  }

  async sendMail(input: SendMailInput): Promise<void> {
    const result = await this.client.emails.send({
      from: `${this.fromName} <${this.fromEmail}>`,
      // So a recipient hitting "Reply" in their inbox reaches DCL directly,
      // not a no-reply address. Same address as `from` here - there is no
      // separate reply inbox configured.
      replyTo: this.fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    });

    if (result.error) {
      throw new Error(`Resend failed to send mail: ${result.error.message}`);
    }
  }
}
