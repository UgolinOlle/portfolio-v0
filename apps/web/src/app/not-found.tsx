'use client';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex max-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-center text-4xl font-bold text-gray-800">{t('common.notFound.title')}</h1>
      <p className="mt-3 max-w-xl text-center text-base text-zinc-600 dark:text-zinc-300">
        {t('common.notFound.description')}
      </p>
      <Link className="mt-5 text-blue-500 hover:text-blue-700" key="projects" href="/">
        {t('common.notFound.link')}
      </Link>
    </div>
  );
}
