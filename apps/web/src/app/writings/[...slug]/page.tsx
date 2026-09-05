import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { WritingsBanner } from '~/components/writings/banner';
import { WritingMDX } from '~/components/writings/writing-mdx';
import { createMetadata } from '~/lib/metadata';
import { writingsSource } from '~/lib/source';

const LANGUAGES = ['fr', 'en'] as const;
type Language = (typeof LANGUAGES)[number];

const resolveLang = (lang: string | undefined): Language =>
  LANGUAGES.includes(lang as Language) ? (lang as Language) : 'fr';

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = writingsSource.getPage(slug, resolveLang(lang));

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
  const page = writingsSource.getPage(slug, resolveLang(lang));

  if (!page) {
    notFound();
  }

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/writings/${slug.join('/')}`,
  });
};

export default Page;
