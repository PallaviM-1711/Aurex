import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AurexProvider } from '@/context/AurexContext';
import { AurexPayModal } from '@/components/aurex/AurexPayModal';

export const metadata: Metadata = {
  title: 'Aurex AI — High-Performance AI Productivity Suite & Pay-Per-Use Cloud',
  description:
    'All-in-one AI platform for plagiarism detection, text summarization, vision analysis, OCR, and AI chat with revolutionary Aurex Pay-Per-Use micro-billing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08090D] text-gray-100 antialiased selection:bg-purple-600/30 selection:text-white">
        <AuthProvider>
          <AurexProvider>
            {children}
            <AurexPayModal />
          </AurexProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
