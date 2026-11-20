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
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const displayName = fullName?.trim() || email.split('@')[0] || 'Member';
    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';

    const { data, error } = await resend.emails.send({
      from: 'LegalLink Ethiopia <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to LegalLink, ${displayName}! | እንኳን ወደ LegalLink በደህና መጡ!`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                      <td style="background-color:#0f172a;padding:28px 32px;text-align:left;">
                        <span style="display:inline-block;background-color:#f59e0b;color:#0f172a;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                          Verified LegalLink Account
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
                        <p style="margin-top:0;">
                          Your LegalLink account (<strong>${email}</strong>) is now active on Ethiopia’s first digital legal marketplace.
                        </p>
                        <ul style="padding-left:20px;margin:0 0 24px;color:#1e293b;">
                          <li style="margin-bottom:10px;">
                            <strong>Find MOJ-Verified Advocates:</strong> Book fixed-fee consultations across corporate, family, property, and labor law.
                          </li>
                          <li style="margin-bottom:10px;">
                            <strong>Draft Bilingual Legal Forms (LexDraft):</strong> Generate ready-to-use Amharic &amp; English contracts, NDAs, and lease agreements.
                          </li>
                          <li style="margin-bottom:10px;">
                            <strong>Explore Proclamations:</strong> Search Ethiopian federal proclamations and LegalTalk guides anytime.
                          </li>
                        </ul>
                        <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                          <tr>
                            <td style="padding-right:12px;">
                              <a href="${appUrl}/find-a-lawyer" style="display:inline-block;background-color:#f59e0b;color:#0f172a;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">
                                Explore Advocates
                              </a>
                            </td>
                            <td>
                              <a href="${appUrl}/lexdraft" style="display:inline-block;background-color:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">
                                Draft Legal Forms
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color:#f1f5f9;padding:18px 32px;font-size:12px;color:#64748b;text-align:center;">
                        LegalLink Ethiopia &bull; Addis Ababa, Ethiopia &bull; Secure Legal Access
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