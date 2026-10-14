import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { WritingsBanner } from '~/components/writings/banner';
import { WritingMDX } from '~/components/writings/writing-mdx';
import { createMetadata, resolveLocale } from '~/lib/metadata';
import { getPageLocales, writingsSource } from '~/lib/source';

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = writingsSource.getPage(slug, resolveLocale(lang));

  if (!page) {
    notFound();
  }

  return (
    <PortfolioShell>
      <WritingsBanner />
      <BackButton />
      <WritingMDX page={page} />
    </PortfolioShell>
  );
};

export const generateStaticParams = () =>
  writingsSource.getPages().map((page) => ({ slug: page.slugs }));

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = writingsSource.getPage(slug, resolveLocale(lang));

  if (!page) {
    notFound();
  }

  const languages = getPageLocales(writingsSource, slug);
  const requested = resolveLocale(lang);

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/writings/${slug.join('/')}`,
    lang: languages.includes(requested) ? requested : 'fr',
    languages,
  });
};

export default Page;
