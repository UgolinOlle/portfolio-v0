'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { PortfolioShell } from '~/components/core/portfolio-shell';

const SECONDARY_LINKS = [
  { href: '/writings', label: 'Articles' },
  { href: '/ui', label: 'Whoa UI' },
];

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PortfolioShell>
      <section className="flex flex-col items-start gap-5 py-10">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">404</p>

        <h1 className="text-3xl font-medium tracking-tight text-balance text-zinc-950 sm:text-4xl dark:text-zinc-50">
          {t('common.notFound.title')}
        </h1>

        <p className="max-w-[55ch] text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
          {t('common.notFound.description')}
        </p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 text-sm">
          <Link
            className={cn(
              'inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 font-medium text-white',
              'transition-[background-color,transform] duration-200 hover:bg-zinc-800 active:scale-[0.98]',
              'dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
            )}
            href="/"
          >
            {t('common.notFound.link')}
          </Link>

          {SECONDARY_LINKS.map((link) => (
            <Link
              className="font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </PortfolioShell>
  );
}
