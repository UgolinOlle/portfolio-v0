'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import { SectionHeading } from '~/components/sections/section-heading';
import type { WritingSummary } from '~/components/writings/writings-list';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { formatDate } from '~/lib/format-date';

const RECENT_WRITINGS_COUNT = 5;

type RecentWritingsSectionProps = {
  pages: (WritingSummary & { lang: string })[];
};

export function RecentWritingsSection({ pages }: RecentWritingsSectionProps) {
  const { t, i18n } = useTranslation();

  const recentPages = useMemo(
    () =>
      pages
        .filter((page) => page.lang === i18n.language)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, RECENT_WRITINGS_COUNT),
    [pages, i18n.language],
  );

  if (recentPages.length === 0) {
    return null;
  }

  return (
    <m.section {...SECTION_REVEAL_LIST} className="space-y-4">
      <SectionHeading
        action={
          <Link
            className="group inline-flex items-center gap-1 rounded text-sm text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-zinc-400 dark:hover:text-zinc-50"
            href="/writings"
          >
            {t('writings.seeAll')}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        }
      >
        {t('writings.recentTitle')}
      </SectionHeading>

      <div className="flex flex-col space-y-2">
        {recentPages.map((page) => (
          <m.div
            className="relative overflow-hidden bg-zinc-300/30 p-px dark:bg-zinc-600/30"
            key={page.url}
            transition={TRANSITION_SECTION}
            variants={VARIANTS_SECTION}
          >
            <Link
              className={cn(
                'group relative flex flex-col gap-1 bg-white p-4 dark:bg-zinc-950',
                'transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]',
                'hover:bg-zinc-50 dark:hover:bg-zinc-900',
              )}
              href={page.url}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-[450] text-zinc-900 transition-opacity group-hover:opacity-60 dark:text-zinc-50">
                  {page.title}
                </span>

                <span className="shrink-0 rounded-full border border-zinc-300 px-2 py-0.5 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  {page.category}
                </span>
              </div>

              <time className="text-xs text-zinc-500 dark:text-zinc-400" dateTime={page.date}>
                {formatDate(page.date, i18n.language)}
              </time>
            </Link>
          </m.div>
        ))}
      </div>
    </m.section>
  );
}
