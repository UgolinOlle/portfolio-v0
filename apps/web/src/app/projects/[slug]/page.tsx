import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { BackButton } from '~/components/projects/back-button';
import { ProjectMDX } from '~/components/projects/project-mdx';
import { createMetadata } from '~/lib/metadata';
import { projectsSource } from '~/lib/source';

const LANGUAGES = ['fr', 'en'] as const;
type Language = (typeof LANGUAGES)[number];

const resolveLang = (lang: string | undefined): Language =>
  LANGUAGES.includes(lang as Language) ? (lang as Language) : 'fr';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = projectsSource.getPage([slug], resolveLang(lang));

  if (!page) {
    notFound();
  }

  return (
    <div className="group/layout relative mx-auto w-full flex-1 px-4 py-20 pt-24 font-sans lg:max-w-3xl">
      <Header />
      <BackButton />
      <ProjectMDX page={page} />
      <Footer />
    </div>
  );
};

export const generateStaticParams = () =>
  projectsSource.getPages().map((page) => ({ slug: page.slugs[0] }));

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { lang } = await searchParams;
  const page = projectsSource.getPage([slug], resolveLang(lang));

  if (!page) {
    notFound();
  }

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/projects/${slug}`,
  });
};

export default Page;
