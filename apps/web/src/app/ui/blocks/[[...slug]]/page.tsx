import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RegistryDocsPage } from '~/components/docs/docs-page';
import { createDocsMetadata } from '~/lib/metadata';
import { blocksSource } from '~/lib/source';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const BlocksPage = async (props: PageProps) => {
  const params = await props.params;

  return <RegistryDocsPage slug={params.slug} source={blocksSource} type="block" />;
};

export const generateStaticParams = async () => blocksSource.generateParams();

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const page = blocksSource.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const slugPath = params.slug?.join('/') ?? '';

  return createDocsMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/ui/blocks${slugPath ? `/${slugPath}` : ''}`,
    ogImage: `/og/docs/blocks/${slugPath}/image.png`,
  });
};

export default BlocksPage;
