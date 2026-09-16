export interface MailAttachment {
  filename: string;
  content: Buffer;
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: MailAttachment[];
}

export interface MailProvider {
  sendMail(input: SendMailInput): Promise<void>;
}
