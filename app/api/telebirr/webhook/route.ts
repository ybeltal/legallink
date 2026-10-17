import { NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  return createBrowserClient(url, key);
}

// 1. GET: Render an interactive Visual Gateway Dashboard when opened in Chrome
export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LegalLink Telebirr Escrow Gateway</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div class="flex items-center justify-between pb-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-[#0072CE]/20 text-[#0072CE] border border-[#0072CE]/30 flex items-center justify-center font-black text-xl">
              TLB
            </div>
            <div>
              <h1 class="text-lg font-black text-white">Telebirr Escrow Listener</h1>
              <span class="text-xs text-slate-400">LegalLink Core API Endpoint</span>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online & Ready
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
            <div class="flex justify-between">
              <span class="text-slate-500 font-semibold">Service Protocol:</span>
              <span class="font-mono text-slate-300">C2B USSD / B2C Payout Callback</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500 font-semibold">Accepted Method:</span>
              <span class="font-mono font-bold text-amber-400">HTTP POST</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500 font-semibold">Escrow Bank:</span>
              <span class="text-slate-300">National Bank of Ethiopia Trust Pool</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500 font-semibold">Standard Retainer:</span>
              <span class="font-bold text-emerald-400">ETB 1,500.00</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[#0072CE]/10 rounded-2xl border border-[#0072CE]/20 text-xs text-slate-300 leading-relaxed">
          <strong class="text-white block mb-1">Telebirr Integration Active</strong>
          This server-side URL receives instant payment verifications from Ethio Telecom. When a client enters their PIN, the payment status automatically locks in escrow.
        </div>

        <div class="flex items-center justify-between pt-2 text-xs">
          <a href="/" class="text-slate-400 hover:text-white transition-colors">
            ← Return to Public Marketplace
          </a>
          <a href="/admin" class="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Open Admin Oversight →
          </a>
        </div>

      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    status: 200,
  });
}

// 2. POST: Receive real-time payment notifications from Telebirr
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const consultationId = body.consultation_id || body.outTradeNo || body.case_id;
    const transactionRef = body.transaction_ref || body.transactionNo || body.txn_ref || `TLB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const amount = Number(body.amount || body.totalAmount || 1500);
    const phone = body.phone_number || body.msisdn || '0905941865';
    const clientName = body.client_name || 'Client';
    const tradeStatus = String(body.status || body.tradeStatus || 'SUCCESS').toUpperCase();
    const paymentStatus = tradeStatus === 'FAILED' ? 'unpaid' : 'escrow_locked';

    const supabase = getSupabase();

    // Update the consultation record
    if (consultationId) {
      await supabase
        .from('consultations')
        .update({
          payment_status: paymentStatus,
          payment_method: 'telebirr',
          transaction_ref: transactionRef,
          escrow_amount: amount,
        })
        .eq('id', consultationId);
    }

    // Insert audit record into escrow_transactions
    await supabase
      .from('escrow_transactions')
      .insert([
        {
          consultation_id: consultationId || null,
          client_name: clientName,
          phone_number: phone,
          payment_channel: 'telebirr',
          amount_etb: amount,
          transaction_ref: transactionRef,
          status: paymentStatus,
        },
      ]);

    return NextResponse.json(
      {
        code: 0,
        message: 'Telebirr webhook processed and escrow secured',
        data: {
          transaction_ref: transactionRef,
          consultation_id: consultationId,
          escrow_status: paymentStatus,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown exception';
    return NextResponse.json(
      { code: 500, message: 'Internal Webhook Failure', error: errorMessage },
      { status: 500 }
    );
  }
}