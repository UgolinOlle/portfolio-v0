import { generate as DefaultImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { blocksSource, componentsSource } from '~/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const [section, ...rest] = slug;
  const source = section === 'blocks' ? blocksSource : componentsSource;
  const page = source.getPage(rest.slice(0, -1));

  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site="Ugolin Ollé" />,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  const componentsParams = componentsSource.getPages().map((page) => ({
    slug: ['components', ...page.slugs, 'image.png'],
  }));
  const blocksParams = blocksSource.getPages().map((page) => ({
    slug: ['blocks', ...page.slugs, 'image.png'],
  }));

  return [...componentsParams, ...blocksParams];
}
