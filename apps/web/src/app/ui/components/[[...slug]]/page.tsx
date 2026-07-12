import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RegistryDocsPage } from '~/components/docs/docs-page';
import { componentsSource } from '~/lib/source';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;

  return <RegistryDocsPage slug={params.slug} source={componentsSource} type="component" />;
};

export const generateStaticParams = async () => componentsSource.generateParams();

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const page = componentsSource.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const ogUrl = `/og/docs/components/${params.slug?.join('/') ?? ''}/image.png`;

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

export default Page;
