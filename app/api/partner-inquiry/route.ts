import { NextResponse } from 'next/server';
import { escapeHtml, sendLegalLinkEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      organizationName,
      contactName,
      email,
      phone,
      organizationType,
      partnershipArea,
      message,
    } = body || {};

    if (!organizationName || !contactName || !email || !message) {
      return NextResponse.json(
        { error: 'Please complete all required partnership inquiry fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const adminInbox = (
      process.env.GMAIL_USER || 'info.legallinkethiopia@gmail.com'
    ).trim();

    const safeOrg = escapeHtml(String(organizationName).trim());
    const safeContact = escapeHtml(String(contactName).trim());
    const safeEmail = escapeHtml(cleanEmail);
    const safePhone = escapeHtml(String(phone || 'Not provided').trim());
    const safeOrgType = escapeHtml(String(organizationType || 'Partner').trim());
    const safeArea = escapeHtml(String(partnershipArea || 'General Partnership').trim());
    const safeMsg = escapeHtml(String(message).trim());

    // 1. Send notification to LegalLink official inbox
    await sendLegalLinkEmail({
      to: adminInbox,
      replyTo: cleanEmail,
      subject: `[Partnership Inquiry] ${safeOrg} — ${safeArea}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
          <h2 style="color:#0A1128;margin-bottom:8px;">New Institutional / Donor Partnership Inquiry</h2>
          <p><strong>Organization:</strong> ${safeOrg} (${safeOrgType})</p>
          <p><strong>Contact Person:</strong> ${safeContact}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Partnership Focus:</strong> ${safeArea}</p>
          <div style="margin-top:14px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
            <strong>Message:</strong><br/>
            <p style="margin:6px 0 0;white-space:pre-wrap;">${safeMsg}</p>
          </div>
        </div>
      `,
    });

    // 2. Send confirmation receipt to the prospective partner
    if (cleanEmail.includes('@')) {
      await sendLegalLinkEmail({
        to: cleanEmail,
        subject: `Partnership Inquiry Received — LegalLink Ethiopia`,
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
                          <span style="display:inline-block;background-color:#f59e0b;color:#0A1128;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                            LegalLink Institutional Desk
                          </span>
                          <h1 style="margin:12px 0 4px;font-size:22px;color:#ffffff;">
                            Thank you for reaching out, ${safeContact}
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:26px 32px;font-size:14px;line-height:1.65;color:#334155;">
                          <p style="margin-top:0;">
                            We have received the partnership inquiry from <strong>${safeOrg}</strong> regarding <strong>${safeArea}</strong>.
                          </p>
                          <p>
                            Our founding team (Yeabsira Semu &amp; Ybeltal Semagn) will review your note and reply within 1–2 business days. For urgent coordination, you can reach us directly at <strong>+251-964-600-737</strong> or <strong>+251-905-941-865</strong>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color:#f1f5f9;padding:16px 32px;font-size:12px;color:#64748b;text-align:center;">
                          <strong>LegalLink Ethiopia</strong> &bull; info.legallinkethiopia@gmail.com &bull; Addis Ababa, Ethiopia<br/>
                          <em>“Justice delayed is justice denied — LegalLink ensures it is neither.”</em>
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
    }

    // 3. Dispatch Telegram alert asynchronously if configured
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const tgText =
        `🤝 NEW PARTNERSHIP INQUIRY\n\n` +
        `Org: ${String(organizationName).trim()} (${String(organizationType || 'Partner')})\n` +
        `Contact: ${String(contactName).trim()}\n` +
        `Focus: ${String(partnershipArea || 'General')}\n` +
        `Check info.legallinkethiopia@gmail.com for full details.`;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: tgText,
          disable_web_page_preview: true,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Could not process partnership inquiry.',
      },
      { status: 500 }
    );
  }
}