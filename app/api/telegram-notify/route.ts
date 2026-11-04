import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram notification skipped: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.');
      return NextResponse.json({ success: false, reason: 'unconfigured' }, { status: 200 });
    }

    let message = '';

    if (event === 'consultation_booked') {
      message = 
        `⚖️ *NEW CONSULTATION BOOKING*\n\n` +
        `👤 *Client:* ${data.client_name}\n` +
        `📞 *Phone:* \`${data.client_phone}\`\n` +
        `🏛 *Advocate:* ${data.lawyer_name}\n` +
        `📂 *Practice Area:* ${data.practice_area}\n` +
        `💰 *Retainer:* ETB ${Number(data.fee_etb || 0).toLocaleString()} (Telebirr Escrow)\n` +
        `⏱ *Urgency:* ${data.urgency || 'Standard'}\n` +
        `📝 *Brief:* _${(data.brief || 'No additional details provided').slice(0, 200)}_\n\n` +
        `🔗 [Open Admin Console](https://legallink-two.vercel.app/admin)`;
    } else if (event === 'advocate_registered') {
      message = 
        `🏛 *NEW ADVOCATE CHAMBER REGISTRATION*\n\n` +
        `👤 *Advocate:* ${data.name} (${data.amharic_name || 'N/A'})\n` +
        `📜 *License:* \`${data.license_number}\`\n` +
        `⚖️ *Jurisdiction:* ${data.court_jurisdiction}\n` +
        `💰 *Hourly Rate:* ETB ${Number(data.hourly_rate_etb || 0).toLocaleString()}\n` +
        `📞 *Phone:* \`${data.phone}\`\n` +
        `📧 *Email:* ${data.email}\n` +
        `📍 *Location:* ${data.location}\n\n` +
        `🔗 [Review in Admin Vetting Queue](https://legallink-two.vercel.app/admin)`;
    } else if (event === 'student_application') {
      message = 
        `🎓 *NEW NEXTGEN CANDIDATE APPLICATION*\n\n` +
        `👤 *Applicant:* ${data.applicant_name}\n` +
        `🏛 *University:* ${data.university} (${data.current_year})\n` +
        `💼 *Opportunity:* ${data.opportunity_title}\n` +
        `📞 *Phone:* \`${data.applicant_phone}\`\n\n` +
        `🔗 [Open NextGen Applications](https://legallink-two.vercel.app/admin)`;
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
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const tgData = await tgRes.json();
    return NextResponse.json({ success: tgData.ok });
  } catch (error: any) {
    console.error('Telegram notification route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}