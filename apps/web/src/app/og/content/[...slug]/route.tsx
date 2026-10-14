import { generate as DefaultImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { siteConfig } from '~/lib/metadata';
import { projectsSource, writingsSource } from '~/lib/source';

export const revalidate = false;

const sourceBySection = {
  projects: projectsSource,
  writings: writingsSource,
};

/** Social preview image for a project or writing: `/og/content/<section>/<...slugs>/image.png`. */
export async function GET(_req: Request, { params }: RouteContext<'/og/content/[...slug]'>) {
  const { slug } = await params;
  const [section, ...rest] = slug;
  const source = sourceBySection[section as keyof typeof sourceBySection];
  const page = rest.at(-1) === 'image.png' ? source?.getPage(rest.slice(0, -1)) : undefined;

  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site={siteConfig.name}
    />,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return Object.entries(sourceBySection).flatMap(([section, source]) =>
    source.getPages().map((page) => ({ slug: [section, ...page.slugs, 'image.png'] })),
  );
}
