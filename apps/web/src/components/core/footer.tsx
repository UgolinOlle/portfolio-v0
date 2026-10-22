'use client';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { TextLoop } from '~/components/effects/text-loop';

const FOOTER_LINKS = [
  { href: '/writings', labelKey: 'navigation.writings' },
  { href: '/ui', labelKey: 'navigation.ui' },
  { href: '/inspirations', labelKey: 'navigation.inspirations' },
] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <a href="https://github.com/UgolinOlle" rel="noreferrer" target="_blank">
          <TextLoop className="text-xs text-zinc-500">
            <span>© {new Date().getFullYear()} Ugolin Ollé</span>
            <span>{t('navigation.madeWith')}</span>
          </TextLoop>
        </a>

        <nav aria-label="Footer" className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
              href={link.href}
              key={link.href}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
