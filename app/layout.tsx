import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'LegalLink Ethiopia | Verified Legal Services Marketplace',
  description: 'Connect with verified Ethiopian advocates under Federal Ministry of Justice standards and Telebirr Escrow custody.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}