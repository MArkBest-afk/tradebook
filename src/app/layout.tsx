import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from './providers';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tradebot FacebookAI',
  description: 'AI-powered trading assistant from Facebook AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <AppProviders>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto py-6 px-4">
              {children}
            </main>
          </div>
          <Toaster />
          <Link href="/faq" passHref>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-4 left-4 h-16 w-16 rounded-full shadow-lg z-50"
              aria-label="Frequently Asked Questions"
            >
              <HelpCircle className="h-8 w-8" />
            </Button>
          </Link>
        </AppProviders>
      </body>
    </html>
  );
}
