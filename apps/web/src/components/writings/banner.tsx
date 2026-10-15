'use client';

import { useTranslation } from '~/components/core/i18n-provider';
import { EMAIL } from '~/lib/constants';

/** Slim review notice above articles (was a WebGL effect pulling in three.js on every article). */
function WritingsBanner() {
  const { t } = useTranslation();

  return (
    <p className="mb-10 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-pretty text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
      {t('writings.notice')}{' '}
      <a
        className="font-medium text-zinc-900 underline underline-offset-2 hover:no-underline dark:text-zinc-100"
        href={`mailto:${EMAIL}`}
      >
        {t('writings.noticeCta')}
      </a>
    </p>
  );
}

export { WritingsBanner };
