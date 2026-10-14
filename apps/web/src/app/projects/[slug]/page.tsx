import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '~/components/core/json-ld';
import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { NextProject } from '~/components/projects/next-project';
import { ProjectMDX } from '~/components/projects/project-mdx';
import { createMetadata, resolveLocale } from '~/lib/metadata';
import { projectsSource, resolvePageLocale } from '~/lib/source';
import { projectSchema } from '~/lib/structured-data';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = projectsSource.getPage([slug], resolveLocale(lang));

  if (!page) {
    notFound();
  }

  const pageLocale = resolvePageLocale(projectsSource, [slug], lang).lang;

  return (
    <PortfolioShell>
      <JsonLd
        data={projectSchema({
          title: page.data.title,
          description: page.data.description,
          pathname: `/projects/${slug}`,
          lang: pageLocale,
        })}
      />
      <BackButton />
      <ProjectMDX page={page} />
      <NextProject lang={pageLocale} slug={slug} />
    </PortfolioShell>
  );
};

export const generateStaticParams = () =>
  projectsSource.getPages().map((page) => ({ slug: page.slugs[0] }));

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = projectsSource.getPage([slug], resolveLocale(lang));

  if (!page) {
    notFound();
  }

  return createMetadata({
    title: page.data.seoTitle ?? page.data.title,
    description: page.data.description,
    pathname: `/projects/${slug}`,
    image: `/og/content/projects/${slug}/image.png`,
    ...resolvePageLocale(projectsSource, [slug], lang),
  });
};

export default Page;
