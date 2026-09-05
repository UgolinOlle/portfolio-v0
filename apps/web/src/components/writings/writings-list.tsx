'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { TextHoverEnter } from '~/components/ui/text-hover';

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

const SLIDE_ANIMATION_DISTANCE = 20;

export function WritingsList({ pages }: WritingsListProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(pages.map((page) => page.category))),
    [pages],
  );

  const filteredPages = useMemo(
    () => (selectedCategory ? pages.filter((page) => page.category === selectedCategory) : pages),
    [pages, selectedCategory],
  );

  if (pages.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('writings.noWritings')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            'px-3 py-1 text-sm transition-colors',
            selectedCategory === null
              ? 'bg-primary-foreground text-primary'
              : 'border-zinc-300 text-primary/50 hover:bg-primary-foreground dark:border-zinc-700',
          )}
          onClick={() => setSelectedCategory(null)}
          type="button"
        >
          <TextHoverEnter>{t('writings.filterAll')}</TextHoverEnter>
        </button>

        {categories.map((category) => (
          <button
            className={cn(
              'px-3 py-1 text-sm transition-colors',
              selectedCategory === category
                ? 'bg-primary-foreground text-primary'
                : 'border-zinc-300 text-primary/50 hover:bg-primary-foreground dark:border-zinc-700',
            )}
            key={category}
            onClick={() => setSelectedCategory(category)}
            type="button"
          >
            <TextHoverEnter>{category}</TextHoverEnter>
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredPages.map((page) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -SLIDE_ANIMATION_DISTANCE }}
              initial={{ opacity: 0, y: SLIDE_ANIMATION_DISTANCE }}
              key={page.url}
              layout
              transition={{ duration: 0.2 }}
            >
              <Link className="group flex flex-col gap-1 py-4" href={page.url}>
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

                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                  {page.date}
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
