import nodemailer from 'nodemailer';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendLegalLinkEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<{ messageId: string }> {
  const user = (
    process.env.GMAIL_USER || 'info.legallinkethiopia@gmail.com'
  ).trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || '')
    .replace(/\s+/g, '')
    .trim();

  if (!user || !pass) {
    throw new Error(
      'Gmail SMTP is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local and Vercel.'
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from: `LegalLink Ethiopia <${user}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    replyTo: replyTo || user,
    subject,
    html,
  });

  return { messageId: info.messageId };
}