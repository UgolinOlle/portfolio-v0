import './global.css';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '~/components/providers';
import { cn } from '~/lib/utils';

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
    <html lang="en" className={cn(inter.className, ibmPlexMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
