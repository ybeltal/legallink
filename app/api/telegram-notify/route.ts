import { NextResponse } from 'next/server';

function clean(val: unknown, fallback = 'N/A'): string {
  if (val === null || val === undefined) return fallback;
  return String(val)
    .replace(/[_*`[\]()]/g, ' ')
    .trim() || fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data } = body || {};

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ success: false, reason: 'unconfigured' }, { status: 200 });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';
    let message = '';

    if (event === 'consultation_booked') {
      message =
        `⚖️ NEW FREE CONSULTATION INQUIRY\n\n` +
        `Ref: ${clean(data?.reference, 'NEW')}\n` +
        `Client: ${clean(data?.client_name)}\n` +
        `Advocate: ${clean(data?.lawyer_name)}\n` +
        `Practice Area: ${clean(data?.practice_area)}\n` +
        `Timeline: ${clean(data?.urgency, 'Standard')} (${clean(data?.mode, 'Direct')})\n\n` +
        `Review full confidential details in Admin Console:\n${appUrl}/admin`;
    } else if (event === 'advocate_registered') {
      message =
        `🏛 NEW ADVOCATE REGISTRATION (MOJ VETTING)\n\n` +
        `Advocate: ${clean(data?.name)}\n` +
        `License: ${clean(data?.license_number)}\n` +
        `Jurisdiction: ${clean(data?.court_jurisdiction)}\n` +
        `Location: ${clean(data?.location)}\n\n` +
        `Verify credentials in Admin Console:\n${appUrl}/admin`;
    } else if (event === 'student_application') {
      message =
        `🎓 NEW NEXTGEN APPLICATION\n\n` +
        `Candidate: ${clean(data?.applicant_name)}\n` +
        `University: ${clean(data?.university)} (${clean(data?.current_year)})\n` +
        `Opportunity: ${clean(data?.opportunity_title)}\n\n` +
        `Review in Admin Console:\n${appUrl}/admin`;
    } else if (event === 'opportunity_posted') {
      message =
        `💼 NEW NEXTGEN OPPORTUNITY POSTED\n\n` +
        `Title: ${clean(data?.title)}\n` +
        `Organization: ${clean(data?.organization)}\n` +
        `Track: ${clean(data?.track)}\n` +
        `Location: ${clean(data?.location)}\n\n` +
        `Moderate in Admin Console:\n${appUrl}/admin`;
    }

    if (!message) {
      return NextResponse.json({ success: false, reason: 'unknown_event' }, { status: 400 });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });

    const tgData = await tgRes.json();
    return NextResponse.json({ success: Boolean(tgData.ok) });
  } catch (error: unknown) {
    console.error('Telegram notification route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Telegram error' },
      { status: 500 }
    );
  }
}