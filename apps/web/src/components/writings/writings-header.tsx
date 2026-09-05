'use client';

import { useTranslation } from '~/components/core/i18n-provider';

export function WritingsHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-10 space-y-2">
      <h1 className="text-2xl font-medium">{t('writings.pageTitle')}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">{t('writings.pageSubtitle')}</p>
    </div>
  );
}
