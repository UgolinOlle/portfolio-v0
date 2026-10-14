import './global.css';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '~/components/core/providers';
import { defaultMetadata, defaultViewport } from '~/lib/metadata';

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

type LayoutProps = {
  readonly children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" className={cn(geistSans.variable, geistMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
