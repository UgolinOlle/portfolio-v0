import { notFound } from 'next/navigation';

import { blocksSource, getLLMText } from '~/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/blocks/[[...slug]]'>) {
  const { slug } = await params;
  const page = blocksSource.getPage(slug);

  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}

export function generateStaticParams() {
  return blocksSource.generateParams();
}
