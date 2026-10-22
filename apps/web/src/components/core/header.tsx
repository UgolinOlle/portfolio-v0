'use client';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { LanguageSwitcher } from '~/components/effects/language-switcher';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';
import { SOCIAL_LINKS } from '~/lib/data';

import { SocialLinksNav } from '../effects/social-links-nav';

import { SiteNav } from './site-nav';

function Header() {
  const { t } = useTranslation();

  return (
    <header className="mb-14 flex flex-col items-start justify-between gap-4 sm:items-center sm:gap-6">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-end justify-between gap-4">
          {/* Site identity only: the home hero and every other page render their own <h1>. */}
          <div className="flex flex-col items-start">
            <Link className="text-xl text-black dark:text-white" href="/">
              Ugolin Ollé
            </Link>

            <p className="font-sans font-normal text-primary">{t('header.title')}</p>
          </div>

          <div className="flex items-center gap-2">
            <SiteNav />
            <span
              aria-hidden="true"
              className="mx-1 hidden h-4 w-px bg-zinc-200 sm:block dark:bg-zinc-800"
            />
            <ThemeSwitch />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <SocialLinksNav links={SOCIAL_LINKS} />
      </div>
    </header>
  );
}

export { Header };
