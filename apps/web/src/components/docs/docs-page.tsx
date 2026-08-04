import defaultMdxComponents from 'fumadocs-ui/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from '~/layouts/docs/page';
import type { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { RegistryInstall } from './install';
import { Preview } from './preview';
import { RegistryBreadcrumb } from './registry-breadcrumb';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;

type RegistryDocsPageProps = {
  source: RegistrySource;
  slug: string[] | undefined;
  type: 'component' | 'block' | 'template';
};

export const RegistryDocsPage = ({ source, slug, type }: RegistryDocsPageProps) => {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const isRootIndex = !slug || slug.length === 0;
  const galleryPages =
    isRootIndex && type !== 'component' ? source.getPages().filter((p) => p.url !== page.url) : [];

  return (
    <DocsPage breadcrumb={{ component: <RegistryBreadcrumb /> }} toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>

      {page.data.preview && (
        <div className="mb-8 flex flex-col gap-10">
          <Preview path={page.data.preview} type={type} />
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Installation</h2>
            <RegistryInstall path={page.data.preview} />
          </section>
        </div>
      )}

      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Preview,
          }}
        />
      </DocsBody>

      {galleryPages.length > 0 && (
        <div className="mt-4 flex flex-col gap-16">
          {galleryPages.map((galleryPage) => (
            <section className="flex flex-col gap-4" key={galleryPage.url}>
              <div>
                <Link className="text-lg font-medium hover:underline" href={galleryPage.url}>
                  {galleryPage.data.title}
                </Link>

                {galleryPage.data.description && (
                  <p className="text-fd-muted-foreground text-sm">{galleryPage.data.description}</p>
                )}
              </div>

              {galleryPage.data.preview && <Preview path={galleryPage.data.preview} type={type} />}
            </section>
          ))}
        </div>
      )}
    </DocsPage>
  );
};
