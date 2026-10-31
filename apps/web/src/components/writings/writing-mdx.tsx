import { Toc } from '~/components/core/toc';
import { getMDXComponents } from '~/components/mdx/mdx';
import { WritingsBanner } from '~/components/writings/banner';
import { ReadingProgress } from '~/components/writings/reading-progress';
import { DocsBody } from '~/layouts/docs/page';
import type { writingsSource } from '~/lib/source';

type WritingPage = NonNullable<ReturnType<typeof writingsSource.getPage>>;

type WritingMDXProps = {
  page: WritingPage;
};

export const WritingMDX = ({ page }: WritingMDXProps) => {
  const MDX = page.data.body;

  return (
    <article className="relative md:has-[>aside]:pl-48 xl:has-[>aside]:pl-0">
      <Toc items={page.data.toc} />
      <ReadingProgress />
      <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-5xl dark:text-zinc-50">
        {page.data.title}
      </h1>
      {page.data.description && (
        <p className="mt-4 mb-10 max-w-[52ch] text-lg leading-normal text-pretty text-zinc-600 dark:text-zinc-400">
          {page.data.description}
        </p>
      )}
      <WritingsBanner />

      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
