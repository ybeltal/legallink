import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://legallink-two.vercel.app'),
  title: {
    default: 'LegalLink Ethiopia | Verified Legal Services Marketplace',
    template: '%s | LegalLink Ethiopia',
  },
  description:
    'Connect with verified Ethiopian lawyers for consultations, corporate restructuring, DARA document pre-flight checks, and Telebirr escrow protection.',
  keywords: [
    'Ethiopian Lawyers',
    'Addis Ababa Advocates',
    'Ethiopian Legal Marketplace',
    'ECMA Directive 1030/2024',
    'Telebirr Escrow',
    'DARA Ethiopia Checklist',
    'Labor Proclamation 1156/2019',
    'LegalTalk Ethiopia'
  ],
  authors: [{ name: 'LegalLink Technologies' }],
  creator: 'LegalLink Ethiopia',
  openGraph: {
    title: 'LegalLink Ethiopia | Verified Legal Services Marketplace',
    description:
      'Verified Ministry of Justice advocates, Telebirr USSD escrow trust protection, and statutory document automation.',
    url: 'https://legallink-two.vercel.app',
    siteName: 'LegalLink Ethiopia',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LegalLink Ethiopia',
    description: 'Ethiopia’s first freelance legal marketplace and compliance ecosystem.',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}