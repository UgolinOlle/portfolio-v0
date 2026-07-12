import defaultMdxComponents from 'fumadocs-ui/mdx';
import { notFound } from 'next/navigation';

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from '~/layouts/docs/page';
import type { componentsSource } from '~/lib/source';

import { Preview } from './preview';

type RegistrySource = typeof componentsSource;

type RegistryDocsPageProps = {
  source: RegistrySource;
  slug: string[] | undefined;
  type: 'component' | 'block';
};

export const RegistryDocsPage = ({ source, slug, type }: RegistryDocsPageProps) => {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {page.data.preview && (
        <div className="mb-8">
          <Preview path={page.data.preview} type={type} />
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
    </DocsPage>
  );
};
