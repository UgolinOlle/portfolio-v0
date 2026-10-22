'use client';

import { Toaster } from '@portfolio-v0/shadcn/components/sonner';
import { TooltipProvider } from '@portfolio-v0/shadcn/components/tooltip';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { domMax, LazyMotion, MotionConfig } from 'motion/react';
import { ThemeProvider } from 'next-themes';

import { I18nProvider } from '~/components/core/i18n-provider';
import RegistrySearchDialog from '~/components/docs/search/search-dialog';
import {
  type SearchItem,
  SearchItemsProvider,
} from '~/components/docs/search/search-items-context';
import { fumadocsUiTranslations } from '~/lib/registry-translations';

export function Providers({
  children,
  searchItems,
}: {
  children: React.ReactNode;
  searchItems: SearchItem[];
}) {
  return (
    <SearchItemsProvider items={searchItems}>
      <RootProvider
        i18n={{ locale: 'fr', translations: fumadocsUiTranslations }}
        search={{ SearchDialog: RegistrySearchDialog }}
        theme={{ enabled: false }}
      >
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          enableColorScheme
          storageKey="theme"
          defaultTheme="system"
          attribute="class"
        >
          <I18nProvider>
            <MotionConfig reducedMotion="user">
              <LazyMotion features={domMax}>
                <TooltipProvider>{children}</TooltipProvider>
              </LazyMotion>
            </MotionConfig>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </RootProvider>
    </SearchItemsProvider>
  );
}
