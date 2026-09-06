import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { DemoBanner } from '@/components/layout/demo-banner';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'InterviewAI — Practice. Improve. Get Hired.',
  description:
    'Master your next technical or behavioral job interview with realistic AI voice interviews, dynamic adaptive follow-up questions, resume parsing, and deep STAR method analytics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-primary/30 selection:text-white flex flex-col min-h-screen">
        <ToastProvider>
          <DemoBanner />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
