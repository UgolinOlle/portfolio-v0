'use client';

import { Toaster } from '@portfolio-v0/shadcn/components/sonner';
import { TooltipProvider } from '@portfolio-v0/shadcn/components/tooltip';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from 'next-themes';

import { I18nProvider } from '~/components/core/i18n-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="theme"
        defaultTheme="system"
        attribute="class"
      >
        <I18nProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </I18nProvider>
      </ThemeProvider>
    </RootProvider>
  );
}
