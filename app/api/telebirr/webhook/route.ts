import { NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  return createBrowserClient(url, key);
}

// 1. GET endpoint for health-check / ping
export async function GET() {
  return NextResponse.json({
    service: 'LegalLink Telebirr Webhook Gateway',
    status: 'active',
    protocol: 'C2B / B2C Escrow Listener',
    timestamp: new Date().toISOString(),
  });
}

// 2. POST endpoint to receive real-time payment notifications from Telebirr
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[Telebirr Webhook] Received payload:', body);

    // Support both direct Telebirr format and aggregator formats
    const consultationId = body.consultation_id || body.outTradeNo || body.case_id;
    const transactionRef = body.transaction_ref || body.transactionNo || body.txn_ref || `TLB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const amount = Number(body.amount || body.totalAmount || 1500);
    const phone = body.phone_number || body.msisdn || '0905941865';
    const clientName = body.client_name || 'Client';
    const tradeStatus = (body.status || body.tradeStatus || 'SUCCESS').toUpperCase();
    const paymentStatus = tradeStatus === 'FAILED' ? 'unpaid' : 'escrow_locked';

    const supabase = getSupabase();

    // 1. If consultationId is supplied, update the case in public.consultations
    if (consultationId) {
      const { error: consultError } = await supabase
        .from('consultations')
        .update({
          payment_status: paymentStatus,
          payment_method: 'telebirr',
          transaction_ref: transactionRef,
          escrow_amount: amount,
        })
        .eq('id', consultationId);

      if (consultError) {
        console.error('[Telebirr Webhook] Consultation update error:', consultError);
      }
    }

    // 2. Audit record inserted into public.escrow_transactions
    const { error: txError } = await supabase
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

    if (txError) {
      console.error('[Telebirr Webhook] Transaction audit error:', txError);
    }

    // Return standard acknowledgment response to Telebirr server
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
  } catch (err: any) {
    console.error('[Telebirr Webhook] Uncaught Error:', err);
    return NextResponse.json(
      { code: 500, message: 'Internal Webhook Failure', error: err?.message },
      { status: 500 }
    );
  }
}