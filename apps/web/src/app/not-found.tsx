'use client';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex max-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-center text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('common.notFound.title')}
      </h1>
      <p className="mt-3 max-w-xl text-center text-base text-zinc-600 dark:text-zinc-300">
        {t('common.notFound.description')}
      </p>
      <nav className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
        <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-400" href="/">
          {t('common.notFound.link')}
        </Link>
        <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-400" href="/writings">
          Articles
        </Link>
        <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-400" href="/ui">
          Whoa UI
        </Link>
      </nav>
    </div>
  );
}
