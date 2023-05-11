export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface Nodemailerservice {
  sendEmail(options: EmailMessage): Promise<String>;
}

