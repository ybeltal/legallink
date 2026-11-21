import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import WelcomeBanner from '@/components/WelcomeBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LegalLink | Ethiopia’s Digital Legal Directory & Drafting Hub',
  description:
    'Connect directly with MOJ-verified Ethiopian advocates for free, draft bilingual Amharic & English legal forms on LexDraft, and explore 122 federal proclamations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <LanguageProvider>
          <WelcomeBanner />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}