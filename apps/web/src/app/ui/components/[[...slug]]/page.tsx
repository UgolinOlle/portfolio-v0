import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RegistryDocsPage } from '~/components/docs/docs-page';
import { createDocsMetadata } from '~/lib/metadata';
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

  const slugPath = params.slug?.join('/') ?? '';

  return createDocsMetadata({
    title: page.data.title,
    description: page.data.description,
    pathname: `/ui/components${slugPath ? `/${slugPath}` : ''}`,
    ogImage: `/og/docs/components/${slugPath}/image.png`,
  });
};

export default Page;
