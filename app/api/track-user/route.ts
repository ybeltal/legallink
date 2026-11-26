import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, sendLegalLinkEmail } from '@/lib/mailer';

const FALLBACK_SUPABASE_URL = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

function getSupabaseConfig() {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .replace(/['"]/g, '')
    .trim();
  const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/['"]/g, '')
    .trim();

  return {
    supabaseUrl: rawUrl.startsWith('https://') ? rawUrl : FALLBACK_SUPABASE_URL,
    supabaseAnonKey: rawKey.length > 20 ? rawKey : FALLBACK_SUPABASE_ANON_KEY,
  };
}

function cleanText(val: unknown, fallback = 'Not provided'): string {
  if (val === null || val === undefined) return fallback;
  const s = String(val).replace(/[_*`[\]()]/g, ' ').trim();
  return s || fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      role = 'client',
      phone = '',
      location = '',
      legalNeed = '',
      provider = 'email',
      eventType = 'signin', // 'signup' | 'signin'
    } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const resolvedName =
      (typeof fullName === 'string' && fullName.trim()) ||
      cleanEmail.split('@')[0] ||
      'Member';
    const resolvedRole = role === 'advocate' ? 'advocate' : 'client';
    const resolvedProvider = String(provider || 'email').trim();
    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://legallink-two.vercel.app';

    // 1. Save / update user in public.platform_users via secure RPC
    let isNewUser = eventType === 'signup';
    try {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data: rpcIsNew, error: rpcError } = await supabase.rpc(
        'record_platform_user',
        {
          p_email: cleanEmail,
          p_full_name: resolvedName,
          p_role: resolvedRole,
          p_phone: phone ? String(phone).trim() : null,
          p_location: location ? String(location).trim() : null,
          p_legal_need: legalNeed ? String(legalNeed).trim() : null,
          p_auth_provider: resolvedProvider,
        }
      );

      if (!rpcError && typeof rpcIsNew === 'boolean') {
        isNewUser = rpcIsNew;
      }
    } catch (dbErr) {
      console.error('platform_users RPC error:', dbErr);
    }

    const actionLabel = isNewUser ? 'NEW USER REGISTERED' : 'USER SIGNED IN';
    const actionEmoji = isNewUser ? '🆕' : '🔑';
    const timestampEAT = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Addis_Ababa',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 2. Dispatch instant Telegram notification + Gmail inbox alert in parallel
    const notifications: Promise<unknown>[] = [];

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const tgText =
        `${actionEmoji} ${actionLabel} ON LEGALLINK\n\n` +
        `Name: ${cleanText(resolvedName)}\n` +
        `Email: ${cleanEmail}\n` +
        `Role: ${resolvedRole.toUpperCase()}\n` +
        `Method: ${cleanText(resolvedProvider)}\n` +
        (phone ? `Phone: ${cleanText(phone)}\n` : '') +
        (location ? `Location: ${cleanText(location)}\n` : '') +
        (legalNeed ? `Interest: ${cleanText(legalNeed)}\n` : '') +
        `Time (EAT): ${timestampEAT}\n\n` +
        `View all users in Admin Console:\n${appUrl}/admin`;

      notifications.push(
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgText,
            disable_web_page_preview: true,
          }),
        }).catch((err) => console.error('Telegram user alert failed:', err))
      );
    }

    const adminInbox = (
      process.env.GMAIL_USER || 'info.legallinkethiopia@gmail.com'
    ).trim();

    notifications.push(
      sendLegalLinkEmail({
        to: adminInbox,
        subject: `[LegalLink] ${actionLabel}: ${resolvedName} (${resolvedRole})`,
        html: `
          <div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
            <h2 style="color:#0A1128;margin-bottom:10px;">${actionEmoji} ${escapeHtml(actionLabel)}</h2>
            <table cellpadding="6" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;width:100%;max-width:520px;font-size:13px;">
              <tr><td style="color:#64748b;width:34%;">Full Name</td><td style="font-weight:700;">${escapeHtml(resolvedName)}</td></tr>
              <tr><td style="color:#64748b;">Email</td><td style="font-weight:700;">${escapeHtml(cleanEmail)}</td></tr>
              <tr><td style="color:#64748b;">Account Role</td><td style="font-weight:700;text-transform:uppercase;">${escapeHtml(resolvedRole)}</td></tr>
              <tr><td style="color:#64748b;">Sign-In Method</td><td>${escapeHtml(resolvedProvider)}</td></tr>
              <tr><td style="color:#64748b;">Phone</td><td>${escapeHtml(phone ? String(phone) : 'Not provided')}</td></tr>
              <tr><td style="color:#64748b;">Location</td><td>${escapeHtml(location ? String(location) : 'Not provided')}</td></tr>
              <tr><td style="color:#64748b;">Legal Need / Area</td><td>${escapeHtml(legalNeed ? String(legalNeed) : 'Not provided')}</td></tr>
              <tr><td style="color:#64748b;">Time (Addis Ababa)</td><td>${escapeHtml(timestampEAT)}</td></tr>
            </table>
            <p style="margin-top:16px;">
              <a href="${appUrl}/admin" style="display:inline-block;background:#0A1128;color:#ffffff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">
                Open Registered Users in Admin Console
              </a>
            </p>
          </div>
        `,
      }).catch((err) => console.error('Admin email user alert failed:', err))
    );

    await Promise.allSettled(notifications);

    return NextResponse.json({ success: true, isNewUser });
  } catch (err) {
    console.error('/api/track-user error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to track user' },
      { status: 500 }
    );
  }
}