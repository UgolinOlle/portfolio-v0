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
    <article className="relative">
      <Toc items={page.data.toc} />
      <ReadingProgress />
      <h1 className="text-[clamp(2.25rem,1.25rem+3vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-zinc-950 dark:text-zinc-50">
        {page.data.title}
      </h1>
      {page.data.description && (
        <p className="mt-4 mb-10 max-w-[52ch] text-lg leading-normal text-pretty text-zinc-600 dark:text-zinc-400">
          {page.data.description}
        </p>
      )}
      <WritingsBanner />

      <DocsBody className="[&_h2]:leading-[1.2] [&_h2]:tracking-[-0.02em] [&_h3]:leading-[1.25] [&_h3]:tracking-[-0.015em]">
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
