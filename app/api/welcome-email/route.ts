import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { email, fullName, role = 'client' } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const displayName =
      (typeof fullName === 'string' && fullName.trim()) ||
      email.split('@')[0] ||
      'Member';
    const isAdvocate = role === 'advocate';
    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';

    // Replace RESEND_FROM_EMAIL in Vercel once your custom domain is verified in Resend
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'LegalLink Ethiopia <onboarding@resend.dev>';

    const badgeText = isAdvocate
      ? 'LEGALLINK ADVOCATE NETWORK'
      : 'VERIFIED LEGALLINK ACCOUNT';

    const introText = isAdvocate
      ? `Thank you for joining Ethiopia’s digital legal marketplace with <strong>${email}</strong>. Complete or review your Ministry of Justice chamber profile to connect directly with clients across Ethiopia and the diaspora — completely free during our public launch.`
      : `Your LegalLink account (<strong>${email}</strong>) is now active on Ethiopia’s digital legal marketplace — free to explore and connect directly with verified Ethiopian advocates.`;

    const bulletItems = isAdvocate
      ? `
        <li style="margin-bottom:10px;">
          <strong>MOJ Credential Verification:</strong> Submit your bar license details so clients can verify your court standing with confidence.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Direct Client Inquiries:</strong> Receive structured legal consultation requests directly inside your Advocate Portal.
        </li>
        <li style="margin-bottom:10px;">
          <strong>NextGen Talent &amp; Library:</strong> Access Ethiopian federal proclamations and connect with law student interns.
        </li>
      `
      : `
        <li style="margin-bottom:10px;">
          <strong>Connect with MOJ-Verified Advocates:</strong> Request direct legal consultations across corporate, family, property, and labor law.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Draft Bilingual Legal Forms (LexDraft):</strong> Generate ready-to-use Amharic &amp; English contracts, NDAs, and lease agreements for free.
        </li>
        <li style="margin-bottom:10px;">
          <strong>Explore Proclamations &amp; LegalTalk:</strong> Search Ethiopian federal proclamations and plain-language legal guides anytime.
        </li>
      `;

    const primaryCta = isAdvocate
      ? { label: 'Open Advocate Portal', href: `${appUrl}/advocate/portal` }
      : { label: 'Explore Advocates', href: `${appUrl}/find-a-lawyer` };

    const secondaryCta = isAdvocate
      ? { label: 'Complete Chamber Profile', href: `${appUrl}/advocate/register` }
      : { label: 'Draft Legal Forms', href: `${appUrl}/lexdraft` };

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: isAdvocate
        ? `Welcome to LegalLink Advocate Network, ${displayName}! | እንኳን ወደ LegalLink በደህና መጡ!`
        : `Welcome to LegalLink, ${displayName}! | እንኳን ወደ LegalLink በደህና መጡ!`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                      <td style="background-color:#0A1128;padding:28px 32px;text-align:left;">
                        <span style="display:inline-block;background-color:#f59e0b;color:#0A1128;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                          ${badgeText}
                        </span>
                        <h1 style="margin:14px 0 6px;font-size:24px;line-height:1.3;color:#ffffff;">
                          Welcome to LegalLink, ${displayName}!
                        </h1>
                        <p style="margin:0;font-size:15px;color:#fbbf24;font-weight:600;">
                          እንኳን ወደ LegalLink በደህና መጡ!
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
                          Need help? Visit <a href="${appUrl}" style="color:#0A1128;font-weight:600;">LegalLink Ethiopia</a> anytime.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color:#f1f5f9;padding:18px 32px;font-size:12px;color:#64748b;text-align:center;">
                        LegalLink Ethiopia &bull; Addis Ababa, Ethiopia &bull; Digital Legal Access
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}