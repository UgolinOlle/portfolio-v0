'use client';

import { useTranslation } from '~/components/core/i18n-provider';

export const MAIN_CONTENT_ID = 'main-content';

/** Visually hidden until focused: lets keyboard users jump past the header and social links. */
export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      className="sr-only rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 dark:bg-zinc-50 dark:text-zinc-950"
      href={`#${MAIN_CONTENT_ID}`}
    >
      {t('navigation.skipToContent')}
    </a>
  );
}
