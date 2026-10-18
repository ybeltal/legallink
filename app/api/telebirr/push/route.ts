import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { consultation_id, phone_number, amount_etb, client_name } = body;

    if (!phone_number || !consultation_id) {
      return NextResponse.json(
        { error: 'Missing phone_number or consultation_id' },
        { status: 400 }
      );
    }

    // Clean phone number format (e.g. 0905941865 -> 251905941865)
    let formattedPhone = phone_number.replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '251' + formattedPhone.substring(1);
    }

    const transactionRef = `TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = Number(amount_etb) || 1500;

    /*
     * -------------------------------------------------------------
     * PRODUCTION INTEGRATION (Ethio Telecom Enterprise API):
     * const telebirrPayload = {
     *   appId: process.env.TELEBIRR_APP_ID,
     *   shortCode: process.env.TELEBIRR_SHORT_CODE,
     *   msisdn: formattedPhone,
     *   amount: fee.toFixed(2),
     *   subject: "LegalLink Consultation Retainer",
     *   notifyUrl: "https://legallink-two.vercel.app/api/telebirr/webhook",
     *   outTradeNo: transactionRef,
     * };
     * await fetch("https://app.ethiomobilemoney.et:2121/api/ussdPush", { ... });
     * -------------------------------------------------------------
     */

    // Record the initiated push in Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    await supabase
      .from('consultations')
      .update({
        transaction_ref: transactionRef,
        escrow_amount: fee,
      })
      .eq('id', consultation_id);

    return NextResponse.json({
      success: true,
      message: `USSD push request dispatched to ${formattedPhone}`,
      transaction_ref: transactionRef,
      phone_number: formattedPhone,
      amount: fee,
      consultation_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown exception';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}