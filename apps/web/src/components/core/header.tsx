'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { LanguageSwitcher, TextEffect } from '~/components/ui';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';
import { SOCIAL_LINKS } from '~/lib/data';

import { SocialLinksNav } from '../ui/social-links-nav';

function Header() {
  const { t } = useTranslation();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  return (
    <header className="mb-14 flex flex-col items-start justify-between gap-4 sm:items-center sm:gap-6">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-end justify-between gap-4">
          <div>
            <Link className="text-xl text-black dark:text-white" href="/">
              Ugolin Ollé
            </Link>

            <TextEffect
              as="p"
              className="font-sans font-normal text-primary"
              delay={0}
              per="char"
              preset="fade"
            >
              {t('header.title')}
            </TextEffect>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <SocialLinksNav currentTheme={currentTheme} links={SOCIAL_LINKS} />
      </div>
    </header>
  );
}

export { Header };
