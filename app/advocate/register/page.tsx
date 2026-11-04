'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Scale, ShieldCheck, ArrowRight, CheckCircle2, 
  AlertCircle, Lock, Mail, Phone, User, Building2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

export default function AdvocateRegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [courtStanding, setCourtStanding] = useState('Federal High Court');
  const [hourlyRate, setHourlyRate] = useState<number>(2000);
  const [location, setLocation] = useState('Addis Ababa');
  const [offersPupillage, setOffersPupillage] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const advId = licenseNumber.trim().toUpperCase().startsWith('ETH-BAR') 
        ? licenseNumber.trim().toUpperCase() 
        : `ETH-BAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('lawyer_profiles')
        .insert({
          id: advId,
          name: fullName.trim(),
          amharic_name: amharicName.trim() || fullName.trim(),
          title: `${courtStanding} Advocate`,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          license_number: licenseNumber.trim().toUpperCase(),
          court_jurisdiction: courtStanding,
          hourly_rate_etb: hourlyRate,
          location: location.trim(),
          is_verified: false,
          vetting_status: 'pending',
          offers_pupillage: offersPupillage,
          experience_years: 5,
          rating: 5.0,
          reviews_count: 0
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
          throw new Error('An advocate profile with this Email or Bar License number already exists.');
        }
        throw error;
      }

      // Dispatches Telegram alert asynchronously
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'advocate_registered',
          data: {
            name: fullName.trim(),
            amharic_name: amharicName.trim(),
            license_number: licenseNumber.trim().toUpperCase(),
            court_jurisdiction: courtStanding,
            hourly_rate_etb: hourlyRate,
            phone: phone.trim(),
            email: email.trim(),
            location: location.trim()
          }
        })
      }).catch((tgErr) => console.warn('Telegram registration alert error:', tgErr));

      sessionStorage.setItem('ll_active_advocate_id', advId);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to register advocate profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
              Advocate Chamber Registration
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Join the verified LegalLink advocate registry under Federal Advocacy Proclamation No. 1249/2021.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-emerald-950">Chamber Profile Registered!</h3>
                <p className="text-xs text-emerald-800">
                  Your credentials have been recorded. You can now access your private workspace to manage retainers and view NextGen applicants.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/advocate/portal')}
                className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Enter My Advocate Workspace →
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Advocate Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adv. Abebe Bikila"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Advocate Full Name (Amharic)
                  </label>
                  <input
                    type="text"
                    placeholder="ጠበቃ አበበ ቢቂላ"
                    value={amharicName}
                    onChange={(e) => setAmharicName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="advocate@chambers.et"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Telebirr Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0911 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Federal Bar License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FDRE-ADV-1840/2018"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Court Jurisdiction Level *
                  </label>
                  <select
                    value={courtStanding}
                    onChange={(e) => setCourtStanding(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Federal First Instance">Federal First Instance</option>
                    <option value="Federal High Court">Federal High Court</option>
                    <option value="Federal Supreme Court & Cassation">Federal Supreme Court & Cassation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hourly Retainer Rate (ETB) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800 focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Chambers Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bole, Kazanchis, Gotera..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <strong className="text-[#0A1128] block">NextGen Apprenticeship</strong>
                  <span className="text-amber-900 text-[11px]">
                    Accept law graduate interns under Proclamation No. 1249/2021.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={offersPupillage}
                  onChange={(e) => setOffersPupillage(e.target.checked)}
                  className="w-4 h-4 accent-[#0A1128] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>{loading ? 'Registering with Supreme Court Register...' : 'Complete Advocate Registration'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
                  Already registered? Sign In to Workspace →
                </Link>
              </div>

            </form>
          )}

        </div>
      </main>
    </div>
  );
}