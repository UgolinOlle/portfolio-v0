'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { formatDate } from '~/lib/format-date';

export type WritingSummary = {
  url: string;
  title: string;
  description?: string;
  date: string;
  category: string;
};

type WritingsListProps = {
  pages: WritingSummary[];
};

const FILTER_BUTTON =
  'rounded-full border px-3 py-1 text-sm transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none';
const FILTER_ACTIVE = 'border-transparent bg-primary text-primary-foreground';
const FILTER_IDLE =
  'border-zinc-300 text-primary/60 hover:bg-primary-foreground hover:text-primary dark:border-zinc-700';

export function WritingsList({ pages }: WritingsListProps) {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(pages.map((page) => page.category))),
    [pages],
  );

  // Newest first, like the home page's recent writings.
  const filteredPages = useMemo(
    () =>
      (selectedCategory ? pages.filter((page) => page.category === selectedCategory) : pages)
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [pages, selectedCategory],
  );

  if (pages.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('writings.noWritings')}</p>;
  }

  return (
    <div className="space-y-6">
      {categories.length > 1 && (
        <div aria-label={t('writings.filterLabel')} className="flex flex-wrap gap-2" role="group">
          <button
            aria-pressed={selectedCategory === null}
            className={cn(FILTER_BUTTON, selectedCategory === null ? FILTER_ACTIVE : FILTER_IDLE)}
            onClick={() => setSelectedCategory(null)}
            type="button"
          >
            {t('writings.filterAll')}
          </button>

          {categories.map((category) => (
            <button
              aria-pressed={selectedCategory === category}
              className={cn(
                FILTER_BUTTON,
                selectedCategory === category ? FILTER_ACTIVE : FILTER_IDLE,
              )}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Remounted per filter: a short crossfade, no layout or slide animation. */}
      <m.div
        animate={{ opacity: 1 }}
        className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800"
        initial={{ opacity: 0 }}
        key={selectedCategory ?? 'all'}
        transition={{ duration: 0.15 }}
      >
        {filteredPages.map((page) => (
          <Link className="group flex flex-col gap-1 py-4" href={page.url} key={page.url}>
            <div className="flex items-center justify-between gap-4">
              <span className="font-[450] text-zinc-900 transition-opacity group-hover:opacity-60 dark:text-zinc-50">
                {page.title}
              </span>

              <span className="shrink-0 rounded-full border border-zinc-300 px-2 py-0.5 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                {page.category}
              </span>
            </div>

            {page.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{page.description}</p>
            )}

            <time className="text-xs text-zinc-500 dark:text-zinc-400" dateTime={page.date}>
              {formatDate(page.date, i18n.language)}
            </time>
          </Link>
        ))}
      </m.div>
    </div>
  );
}
