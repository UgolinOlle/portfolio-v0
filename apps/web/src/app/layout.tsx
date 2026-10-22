import './global.css';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '~/components/core/providers';
import { SmoothScroll } from '~/components/effects/smooth-scroll';
import { defaultMetadata, defaultViewport } from '~/lib/metadata';
import { getRegistrySections } from '~/lib/registry';

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
  // Light slice of the registry for the ⌘K dialog (empty-query state and result titles).
  const searchItems = getRegistrySections().flatMap((section) =>
    section.items.map(({ title, description, href, category, featured }) => ({
      title,
      description,
      href,
      category,
      featured,
    })),
  );

  return (
    <html lang="fr" className={cn(geistSans.variable, geistMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll>
          <Providers searchItems={searchItems}>{children}</Providers>
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
