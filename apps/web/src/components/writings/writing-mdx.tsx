import { getMDXComponents } from '~/components/core/mdx';
import { WritingsBanner } from '~/components/writings/banner';
import { ReadingProgress } from '~/components/writings/reading-progress';
import { DocsBody, DocsDescription, DocsTitle } from '~/layouts/docs/page';
import type { writingsSource } from '~/lib/source';

type WritingPage = NonNullable<ReturnType<typeof writingsSource.getPage>>;

type WritingMDXProps = {
  page: WritingPage;
};

export const WritingMDX = ({ page }: WritingMDXProps) => {
  const MDX = page.data.body;

  return (
    <article>
      <ReadingProgress />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <WritingsBanner />

      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
