import type { Metadata } from 'next';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { WritingsHeader } from '~/components/writings/writings-header';
import { WritingsList } from '~/components/writings/writings-list';
import { createMetadata, LOCALES, resolveLocale } from '~/lib/metadata';
import { writingsSource } from '~/lib/source';

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { lang } = await searchParams;
  const pages = writingsSource.getPages(resolveLocale(lang)).map((page) => ({
    url: `/writings/${page.slugs.join('/')}`,
    title: page.data.title,
    description: page.data.description,
    date: page.data.date,
    category: page.data.category,
  }));

  return (
    <PortfolioShell>
      <BackButton href="/writings" title="Writings" />
      <WritingsHeader />
      <WritingsList pages={pages} />
    </PortfolioShell>
  );
};

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { lang } = await searchParams;

  const locale = resolveLocale(lang);
  const copy = {
    fr: {
      title: 'Articles sur le développement web et l’IA',
      description:
        'Notes et articles d’Ugolin Ollé, développeur full stack : développement web, Next.js, IA et retours sur mes projets.',
    },
    en: {
      title: 'Writings on web development and AI',
      description:
        'Notes and articles by Ugolin Ollé, full stack developer: web development, Next.js, AI and lessons from my projects.',
    },
  }[locale];

  return createMetadata({
    ...copy,
    pathname: '/writings',
    lang: locale,
    languages: LOCALES,
  });
};

export default Page;
