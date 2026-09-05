import { getMDXComponents } from '~/components/core/mdx';
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
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>

      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
