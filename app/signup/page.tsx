'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-mono text-slate-400">
      Loading LegalLink Onboarding...
    </div>
  );
}