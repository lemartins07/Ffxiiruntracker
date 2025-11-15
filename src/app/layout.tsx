import type { Metadata } from 'next';
import { Inter, Cinzel, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const notoJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jp', display: 'swap' });

export const metadata: Metadata = {
  title: 'FFXII Run Tracker',
  description: 'Checklist progress tracker for Final Fantasy XII IZJS / Zodiac Age.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} ${notoJP.variable} min-h-screen bg-bg-app text-text-primary`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
