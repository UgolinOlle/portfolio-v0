'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { TextHoverEnter } from '~/components/ui/text-hover';
import type { WritingSummary } from '~/components/writings/writings-list';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

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
    <motion.section
      className="space-y-4"
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{t('writings.recentTitle')}</h3>

        <Link
          className="text-sm text-zinc-500 transition-opacity hover:opacity-60 dark:text-zinc-400"
          href="/writings"
        >
          <TextHoverEnter>{t('writings.seeAll')}</TextHoverEnter>
        </Link>
      </div>

      <div className="flex flex-col space-y-2">
        {recentPages.map((page) => (
          <div
            className="relative overflow-hidden bg-zinc-300/30 p-px dark:bg-zinc-600/30"
            key={page.url}
          >
            <Link
              className="group relative flex flex-col gap-1 bg-white p-4 dark:bg-zinc-950"
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

              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                {page.date}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
