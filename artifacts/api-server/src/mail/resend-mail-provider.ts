import { Resend } from "resend";
import type { MailProvider, SendMailInput } from "./mail-provider";
import { LOGO_CONTENT_ID, loadLogo } from "./logo";

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
    const logo = await loadLogo();

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
      attachments: [
        // Embedded inline (not a visible attachment) and referenced from
        // the templates via `cid:dcl-logo`. Deliberately not a remote
        // <img src> pointing at the marketing site: remote images are
        // blocked by default in most inboxes until the recipient clicks
        // "show images", and would break entirely before the site is
        // deployed or if PUBLIC_SITE_URL is ever wrong.
        { filename: "dcl-logo.png", content: logo, inlineContentId: LOGO_CONTENT_ID },
        ...(input.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          ...(attachment.contentType ? { contentType: attachment.contentType } : {}),
        })) ?? []),
      ],
    });

    if (result.error) {
      throw new Error(`Resend failed to send mail: ${result.error.message}`);
    }
  }
}
