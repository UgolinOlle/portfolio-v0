import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { BackButton } from '~/components/projects/back-button';
import { ProjectMDX } from '~/components/projects/project-mdx';
import { createMetadata, resolveLocale } from '~/lib/metadata';
import { getPageLocales, projectsSource } from '~/lib/source';

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

  return (
    <PortfolioShell>
      <BackButton />
      <ProjectMDX page={page} />
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

  const languages = getPageLocales(projectsSource, [slug]);
  const requested = resolveLocale(lang);

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/projects/${slug}`,
    lang: languages.includes(requested) ? requested : 'fr',
    languages,
  });
};

export default Page;
