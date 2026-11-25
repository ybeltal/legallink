import { NextResponse } from 'next/server';
import { escapeHtml, sendLegalLinkEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, fullName, role = 'client' } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const rawName =
      (typeof fullName === 'string' && fullName.trim()) ||
      cleanEmail.split('@')[0] ||
      'Member';
    const safeName = escapeHtml(rawName);
    const safeEmail = escapeHtml(cleanEmail);
    const isAdvocate = role === 'advocate';
    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';

    const badgeText = isAdvocate
      ? 'LEGALLINK ADVOCATE NETWORK'
      : 'VERIFIED LEGALLINK ACCOUNT';

    const introText = isAdvocate
      ? `Thank you for joining LegalLink Ethiopia with <strong>${safeEmail}</strong>. Complete or manage your Ministry of Justice chamber profile to connect directly with clients across Ethiopia and the diaspora — completely free during our launch phase.`
      : `Your LegalLink Ethiopia account (<strong>${safeEmail}</strong>) is now active. Find verified Ethiopian advocates, draft bilingual legal forms, and explore Ethiopian laws — all in one organized platform.`;

    const bulletItems = isAdvocate
      ? `
        <li style="margin-bottom:10px;">
          <strong>MOJ Credential Verification:</strong> Submit your Federal or Regional bar license so clients can verify your court standing with confidence.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Direct Client Inquiries:</strong> Receive structured consultation requests inside your Advocate Portal with zero listing fees.
        </li>
        <li style="margin-bottom:10px;">
          <strong>LegalTalk &amp; NextGen Hub:</strong> Access 122 Ethiopian proclamations and connect with law student interns under Proclamation No. 1249/2021.
        </li>
      `
      : `
        <li style="margin-bottom:10px;">
          <strong>Connect with Verified Advocates:</strong> Submit free consultation inquiries across corporate, property, family, labour, and diaspora law.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Draft Bilingual Legal Forms (LexDraft):</strong> Generate Amharic &amp; English contracts, powers of attorney, and court filings in minutes.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Legal Center &amp; 122 Federal Laws:</strong> Browse plain-language LegalTalk guides, our bilingual legal dictionary, and official gazette proclamations.
        </li>
      `;

    const primaryCta = isAdvocate
      ? { label: 'Open Advocate Portal', href: `${appUrl}/advocate/portal` }
      : { label: 'Find an Advocate', href: `${appUrl}/find-a-lawyer` };

    const secondaryCta = isAdvocate
      ? { label: 'Complete Chamber Profile', href: `${appUrl}/advocate/register` }
      : { label: 'Try LexDraft Free', href: `${appUrl}/lexdraft` };

    const { messageId } = await sendLegalLinkEmail({
      to: cleanEmail,
      subject: isAdvocate
        ? `Welcome to LegalLink Advocate Network, ${rawName}! | እንኳን ወደ LegalLink በደህና መጡ!`
        : `Welcome to LegalLink Ethiopia, ${rawName}! | እንኳን ወደ LegalLink በደህና መጡ!`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                      <td style="background-color:#0A1128;padding:28px 32px;text-align:left;">
                        <span style="display:inline-block;background-color:#f59e0b;color:#0A1128;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                          ${badgeText}
                        </span>
                        <h1 style="margin:14px 0 6px;font-size:24px;line-height:1.3;color:#ffffff;">
                          Welcome to LegalLink, ${safeName}!
                        </h1>
                        <p style="margin:0;font-size:15px;color:#fbbf24;font-weight:600;">
                          እንኳን ወደ LegalLink ኢትዮጵያ በደህና መጡ!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:28px 32px;font-size:15px;line-height:1.65;color:#334155;">
                        <p style="margin-top:0;">${introText}</p>
                        <ul style="padding-left:20px;margin:0 0 24px;color:#1e293b;">
                          ${bulletItems}
                        </ul>
                        <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                          <tr>
                            <td style="padding-right:12px;">
                              <a href="${primaryCta.href}" style="display:inline-block;background-color:#f59e0b;color:#0A1128;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">
                                ${primaryCta.label}
                              </a>
                            </td>
                            <td>
                              <a href="${secondaryCta.href}" style="display:inline-block;background-color:#0A1128;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">
                                ${secondaryCta.label}
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin-bottom:0;font-size:13px;color:#64748b;">
                          Questions? Reply directly to <strong>info.legallinkethiopia@gmail.com</strong> or call <strong>+251-964-600-737</strong> / <strong>+251-905-941-865</strong>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color:#f1f5f9;padding:18px 32px;font-size:12px;color:#64748b;text-align:center;">
                        <strong>LegalLink Ethiopia</strong> &bull; Addis Ababa, Ethiopia<br/>
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

    return NextResponse.json({ success: true, id: messageId });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Failed to send welcome email',
      },
      { status: 500 }
    );
  }
}