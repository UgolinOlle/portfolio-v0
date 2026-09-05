import './global.css';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '~/components/core/providers';
import { defaultMetadata, defaultViewport } from '~/lib/metadata';

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

const inter = Inter({
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-loaded',
});

type LayoutProps = {
  readonly children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" className={cn(inter.className, ibmPlexMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
