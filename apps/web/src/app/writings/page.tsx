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

  return createMetadata({
    title: 'Writings',
    description: 'Notes et articles sur le développement web et mes projets.',
    pathname: '/writings',
    lang: resolveLocale(lang),
    languages: LOCALES,
  });
};

export default Page;
