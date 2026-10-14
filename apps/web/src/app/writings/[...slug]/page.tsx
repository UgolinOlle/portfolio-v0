import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '~/components/core/json-ld';
import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { WritingsBanner } from '~/components/writings/banner';
import { WritingMDX } from '~/components/writings/writing-mdx';
import { createMetadata, resolveLocale } from '~/lib/metadata';
import { writingsSource, resolvePageLocale } from '~/lib/source';
import { articleSchema } from '~/lib/structured-data';

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
      <JsonLd
        data={articleSchema({
          title: page.data.title,
          description: page.data.description,
          pathname: `/writings/${slug.join('/')}`,
          lang: resolvePageLocale(writingsSource, slug, lang).lang,
          datePublished: page.data.date,
          image: `/og/content/writings/${slug.join('/')}/image.png`,
        })}
      />
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

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/writings/${slug.join('/')}`,
    image: `/og/content/writings/${slug.join('/')}/image.png`,
    publishedTime: page.data.date,
    ...resolvePageLocale(writingsSource, slug, lang),
  });
};

export default Page;
