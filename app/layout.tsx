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
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}