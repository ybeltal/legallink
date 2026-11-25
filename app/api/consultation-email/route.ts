import { NextResponse } from 'next/server';
import { escapeHtml, sendLegalLinkEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      reference,
      clientName,
      clientEmail,
      clientPhone,
      lawyerName,
      practiceArea,
      urgency,
      mode,
    } = body || {};

    if (!clientName || !lawyerName) {
      return NextResponse.json(
        { error: 'clientName and lawyerName are required' },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';
    const adminInbox = (
      process.env.GMAIL_USER || 'info.legallinkethiopia@gmail.com'
    ).trim();

    const safeRef = escapeHtml(String(reference || 'LL-NEW'));
    const safeClient = escapeHtml(String(clientName));
    const safeLawyer = escapeHtml(String(lawyerName));
    const safePractice = escapeHtml(String(practiceArea || 'General Legal Matter'));
    const safeUrgency = escapeHtml(String(urgency || 'Standard'));
    const safeMode = escapeHtml(String(mode || 'Direct'));
    const safePhone = escapeHtml(String(clientPhone || 'Provided in portal'));

    const sentTo: string[] = [];

    // 1. Send confirmation receipt to client if they entered an email address
    if (typeof clientEmail === 'string' && clientEmail.includes('@')) {
      const cleanClientEmail = clientEmail.trim().toLowerCase();
      await sendLegalLinkEmail({
        to: cleanClientEmail,
        subject: `Consultation Request Received (${safeRef}) — LegalLink Ethiopia`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                      <tr>
                        <td style="background-color:#0A1128;padding:24px 32px;">
                          <span style="display:inline-block;background-color:#10b981;color:#ffffff;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                            Inquiry Confirmed • Free Platform Access
                          </span>
                          <h1 style="margin:12px 0 4px;font-size:22px;color:#ffffff;">
                            We received your request, ${safeClient}
                          </h1>
                          <p style="margin:0;font-size:13px;color:#fbbf24;font-weight:600;">
                            Reference ID: ${safeRef}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:26px 32px;font-size:14px;line-height:1.65;color:#334155;">
                          <p style="margin-top:0;">
                            Your consultation inquiry has been routed to <strong>${safeLawyer}</strong>. They will review your summary and contact you directly via <strong>${safePhone}</strong>.
                          </p>
                          <table width="100%" cellpadding="8" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:18px 0;font-size:13px;">
                            <tr>
                              <td style="color:#64748b;width:40%;">Selected Advocate</td>
                              <td style="font-weight:700;color:#0A1128;">${safeLawyer}</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;">Practice Area</td>
                              <td style="font-weight:700;color:#0A1128;">${safePractice}</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;">Timeline &amp; Mode</td>
                              <td style="font-weight:700;color:#0A1128;">${safeUrgency} (${safeMode})</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;">Platform Matching Fee</td>
                              <td style="font-weight:700;color:#047857;">Free (ETB 0)</td>
                            </tr>
                          </table>
                          <p style="font-weight:700;color:#0A1128;margin-bottom:8px;">
                            Before your call — 3 quick things to prepare:
                          </p>
                          <ul style="padding-left:20px;margin:0 0 22px;color:#334155;">
                            <li style="margin-bottom:6px;">Write down key dates (contract date, notice date, or court summons date).</li>
                            <li style="margin-bottom:6px;">Keep copies (not originals) of relevant contracts, receipts, or IDs ready.</li>
                            <li>Note your top 2–3 questions and preferred outcome.</li>
                          </ul>
                          <a href="${appUrl}/legal-center" style="display:inline-block;background-color:#0A1128;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;padding:11px 18px;border-radius:10px;">
                            Explore Legal Center &amp; Preparation Tips
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color:#f1f5f9;padding:16px 32px;font-size:12px;color:#64748b;text-align:center;">
                          LegalLink Ethiopia &bull; info.legallinkethiopia@gmail.com &bull; +251-964-600-737
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
      sentTo.push(cleanClientEmail);
    }

    // 2. Send a non-confidential summary alert to LegalLink official inbox
    await sendLegalLinkEmail({
      to: adminInbox,
      subject: `[LegalLink] New Consultation Inquiry ${safeRef} — ${safePractice}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
          <h2 style="color:#0A1128;margin-bottom:8px;">New Free Consultation Inquiry (${safeRef})</h2>
          <p><strong>Client:</strong> ${safeClient}</p>
          <p><strong>Selected Advocate:</strong> ${safeLawyer}</p>
          <p><strong>Practice Area:</strong> ${safePractice}</p>
          <p><strong>Timeline &amp; Mode:</strong> ${safeUrgency} (${safeMode})</p>
          <p style="margin-top:16px;">
            <a href="${appUrl}/admin" style="display:inline-block;background:#0A1128;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">
              Open Admin Oversight Portal
            </a>
          </p>
        </div>
      `,
    });
    sentTo.push(adminInbox);

    return NextResponse.json({ success: true, sentTo });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to dispatch consultation confirmation email',
      },
      { status: 500 }
    );
  }
}