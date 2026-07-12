import './global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '~/components/providers';

const inter = Inter({
  subsets: ['latin'],
});

type LayoutProps = {
  readonly children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
