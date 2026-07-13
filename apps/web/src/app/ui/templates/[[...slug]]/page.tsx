import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RegistryDocsPage } from '~/components/docs/docs-page';
import { templatesSource } from '~/lib/source';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const TemplatesPage = async (props: PageProps) => {
  const params = await props.params;

  return <RegistryDocsPage slug={params.slug} source={templatesSource} type="template" />;
};

export const generateStaticParams = async () => templatesSource.generateParams();

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const page = templatesSource.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const ogUrl = `/og/docs/templates/${params.slug?.join('/') ?? ''}/image.png`;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'website',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      title: page.data.title,
      description: page.data.description,
      card: 'summary_large_image',
      images: [ogUrl],
    },
  };
};

export default TemplatesPage;
