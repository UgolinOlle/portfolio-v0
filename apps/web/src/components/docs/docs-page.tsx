import type * as PageTree from 'fumadocs-core/page-tree';
import type { TOCItemType } from 'fumadocs-core/toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ConstructionBanner } from '~/components/core/construction-banner';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from '~/layouts/docs/page';
import { GITHUB_REPO } from '~/lib/constants';
import { getRegistryExamples } from '~/lib/registry';
import type { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { RegistryInstall } from './install';
import { Preview } from './preview';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;

type RegistryDocsPageProps = {
  source: RegistrySource;
  slug: string[] | undefined;
  type: 'component' | 'block' | 'template';
};

// Below this, a TOC is just noise next to a short page (e.g. a single "Installation").
const MIN_TOC_ITEMS = 3;

const sectionHeadingClassName = 'scroll-mt-24 text-xl font-semibold tracking-tight';

const SECTIONS = {
  component: { label: 'Composants', segment: 'components' },
  block: { label: 'Blocks', segment: 'blocks' },
  template: { label: 'Templates', segment: 'templates' },
} as const;

const pageActionClassName =
  'h-7 rounded-none border border-foreground/10 bg-transparent px-2.5 font-mono text-[0.6875rem] font-normal tracking-widest text-foreground/60 uppercase shadow-none hover:bg-foreground/3 hover:text-foreground';

const containsUrl = (folder: PageTree.Folder, url: string): boolean =>
  folder.index?.url === url ||
  folder.children.some((node) =>
    node.type === 'page' ? node.url === url : node.type === 'folder' && containsUrl(node, url),
  );

export const RegistryDocsPage = ({ source, slug, type }: RegistryDocsPageProps) => {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const isRootIndex = !slug || slug.length === 0;
  const galleryPages =
    isRootIndex && type !== 'component' ? source.getPages().filter((p) => p.url !== page.url) : [];
  const examples = page.data.preview ? getRegistryExamples(page.data.preview) : [];
  const galleryId = (url: string) => url.split('/').at(-1) ?? url;

  const section = SECTIONS[type];
  const folder = source.pageTree.children.find(
    (node): node is PageTree.Folder => node.type === 'folder' && containsUrl(node, page.url),
  );
  const markdownUrl = `/llms.mdx/${section.segment}${slug?.length ? `/${slug.join('/')}` : ''}`;
  const githubUrl = `https://github.com/${GITHUB_REPO}/blob/stable/apps/web/content/${section.segment}/${page.path}`;

  // Sections rendered outside the MDX body aren't in `page.data.toc`, so they're added here
  // to keep the TOC in sync with what's actually on the page.
  const toc: TOCItemType[] = [
    ...(examples.length > 1
      ? examples.map((example) => ({ title: example.title, url: `#${example.name}`, depth: 2 }))
      : []),
    ...(page.data.preview ? [{ title: 'Installation', url: '#installation', depth: 2 }] : []),
    ...page.data.toc,
    ...galleryPages.map((galleryPage) => ({
      title: galleryPage.data.title,
      url: `#${galleryId(galleryPage.url)}`,
      depth: 2,
    })),
  ];
  const showToc = toc.length >= MIN_TOC_ITEMS;

  return (
    <DocsPage
      breadcrumb={{ enabled: false }}
      full={type !== 'component'}
      tableOfContent={{ enabled: showToc }}
      tableOfContentPopover={{ enabled: showToc }}
      toc={showToc ? toc : []}
    >
      <header className="flex flex-col gap-3 border-b border-foreground/5 pb-8">
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.6875rem] tracking-widest text-foreground/45 uppercase">
            <Link
              className="transition-colors hover:text-foreground"
              href={`/ui/${section.segment}`}
            >
              {section.label}
            </Link>
            {folder && (
              <>
                <span aria-hidden="true" className="px-2 text-foreground/25">
                  /
                </span>
                {folder.name}
              </>
            )}
          </p>
          <div className="flex items-center gap-1">
            <MarkdownCopyButton className={pageActionClassName} markdownUrl={markdownUrl}>
              Copier MD
            </MarkdownCopyButton>
            <ViewOptionsPopover
              className={pageActionClassName}
              githubUrl={githubUrl}
              markdownUrl={markdownUrl}
            >
              Ouvrir dans
            </ViewOptionsPopover>
          </div>
        </div>
        <DocsTitle className="text-[2rem] leading-tight tracking-tight">
          {page.data.title}
        </DocsTitle>
        <DocsDescription className="mb-0 max-w-[60ch] text-pretty">
          {page.data.description}
        </DocsDescription>
      </header>

      <ConstructionBanner className="my-2" />

      {page.data.preview && (
        <div className="flex flex-col gap-12">
          {examples.map((example) => (
            <section className="flex flex-col gap-4" key={example.name}>
              {examples.length > 1 && (
                <div className="flex flex-col gap-1">
                  <h2 className={sectionHeadingClassName} id={example.name}>
                    {example.title}
                  </h2>
                  {example.description && (
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  )}
                </div>
              )}
              <Preview path={example.slug} type={type} />
            </section>
          ))}
          <section className="flex flex-col gap-4">
            <h2 className={sectionHeadingClassName} id="installation">
              Installation
            </h2>
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
        <div className="flex flex-col gap-16">
          {galleryPages.map((galleryPage) => (
            <section className="flex flex-col gap-4" key={galleryPage.url}>
              <div className="flex flex-col gap-1">
                <h2 className={sectionHeadingClassName} id={galleryId(galleryPage.url)}>
                  <Link className="hover:underline" href={galleryPage.url}>
                    {galleryPage.data.title}
                  </Link>
                </h2>

                {galleryPage.data.description && (
                  <p className="text-sm text-muted-foreground">{galleryPage.data.description}</p>
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
