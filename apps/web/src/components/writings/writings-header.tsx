'use client';

import { useTranslation } from '~/components/core/i18n-provider';

export function WritingsHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-12 space-y-3">
      <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-5xl dark:text-zinc-50">
        {t('writings.pageTitle')}
      </h1>
      <p className="max-w-[52ch] text-lg leading-normal text-pretty text-zinc-600 dark:text-zinc-400">
        {t('writings.pageSubtitle')}
      </p>
    </div>
  );
}
