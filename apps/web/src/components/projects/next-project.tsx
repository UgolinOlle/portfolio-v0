import Link from 'next/link';

import { ArrowRightIcon } from '~/components/icons/ui';
import { localizedPath, type Locale } from '~/lib/metadata';
import { projectsSource } from '~/lib/source';

import projectsMeta from '../../../content/projects/meta.json';

const LABELS: Record<Locale, string> = {
  fr: 'Projet suivant',
  en: 'Next project',
};

type NextProjectProps = {
  slug: string;
  lang: Locale;
};

/** Link to the next project in `content/projects/meta.json` order, wrapping around at the end. */
export function NextProject({ slug, lang }: NextProjectProps) {
  const order = projectsMeta.pages;
  const index = order.indexOf(slug);

  if (index === -1 || order.length < 2) {
    return null;
  }

  const nextSlug = order[(index + 1) % order.length];
  const nextPage = projectsSource.getPage([nextSlug], lang) ?? projectsSource.getPage([nextSlug]);

  if (!nextPage) {
    return null;
  }

  return (
    <Link
      className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
      href={localizedPath(`/projects/${nextSlug}`, lang)}
    >
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{LABELS[lang]}</p>
        <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{nextPage.data.title}</p>
        {nextPage.data.description && (
          <p className="mt-1 line-clamp-1 text-sm text-zinc-600 dark:text-zinc-400">
            {nextPage.data.description}
          </p>
        )}
      </div>

      <ArrowRightIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-zinc-400 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
      />
    </Link>
  );
}
