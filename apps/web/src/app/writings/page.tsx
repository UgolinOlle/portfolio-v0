import type { Metadata } from 'next';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { WritingsHeader } from '~/components/writings/writings-header';
import { WritingsList } from '~/components/writings/writings-list';
import { createMetadata } from '~/lib/metadata';
import { writingsSource } from '~/lib/source';

const LANGUAGES = ['fr', 'en'] as const;
type Language = (typeof LANGUAGES)[number];

const resolveLang = (lang: string | undefined): Language =>
  LANGUAGES.includes(lang as Language) ? (lang as Language) : 'fr';

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { lang } = await searchParams;
  const pages = writingsSource.getPages(resolveLang(lang)).map((page) => ({
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

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Writings',
    description: 'Notes et articles sur le développement web et mes projets.',
    pathname: '/writings',
  });

export default Page;
