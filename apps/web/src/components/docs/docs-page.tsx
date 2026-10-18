import { cn } from '@portfolio-v0/shadcn/utils';

import type * as PageTree from 'fumadocs-core/page-tree';
import type { TOCItemType } from 'fumadocs-core/toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ConstructionBanner } from '~/components/core/construction-banner';
import { RegistryGrid } from '~/components/registry/registry-grid';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from '~/layouts/docs/page';
import { GITHUB_REPO } from '~/lib/constants';
import { getRegistryExamples, getRegistryItems } from '~/lib/registry';
import type { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { RegistryInstall } from './install';
import { Preview } from './preview';
import { PrimitivePreview } from './preview/primitive-preview';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;

type RegistryDocsPageProps = {
  source: RegistrySource;
  slug: string[] | undefined;
  type: 'component' | 'block' | 'template';
};

// Below this, a TOC is just noise next to a short page (e.g. a single "Installation").
const MIN_TOC_ITEMS = 3;

const sectionHeadingClassName = 'scroll-mt-24 text-xl font-semibold tracking-tight';

// Section heading with a "#" permalink revealed on hover / focus.
const SectionHeading = ({ id, title }: { id: string; title: string }) => (
  <h2 className={cn(sectionHeadingClassName, 'group/heading flex items-baseline gap-2')} id={id}>
    {title}
    <a
      aria-label={`Lien vers la section « ${title} »`}
      className="label-mono text-foreground/35 opacity-0 transition-opacity group-hover/heading:opacity-100 hover:text-foreground focus-visible:opacity-100"
      href={`#${id}`}
    >
      #
    </a>
  </h2>
);

const SECTIONS = {
  component: { label: 'Composants', segment: 'components' },
  block: { label: 'Blocks', segment: 'blocks' },
  template: { label: 'Templates', segment: 'templates' },
} as const;

// Templates run edge to edge: the page container drops its x padding, so text blocks get it back.
const TEMPLATE_GUTTER = 'px-4 md:px-6 xl:px-8';

const pageActionClassName =
  'label-mono h-7 rounded-none border border-foreground/10 bg-transparent px-2.5 font-normal text-foreground/60 shadow-none hover:bg-foreground/3 hover:text-foreground';

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
  // Introduction pages of blocks / templates list their items as a card grid, like /ui.
  const isTemplate = type === 'template';
  const gutter = isTemplate ? TEMPLATE_GUTTER : undefined;
  const galleryItems = isRootIndex && type !== 'component' ? getRegistryItems(type) : [];
  const examples = page.data.preview ? getRegistryExamples(page.data.preview) : [];

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
  ];
  const showToc = toc.length >= MIN_TOC_ITEMS;

  return (
    <DocsPage
      breadcrumb={{ enabled: false }}
      className={isTemplate ? 'max-w-none px-0 md:px-0 xl:px-0' : undefined}
      full={type !== 'component'}
      tableOfContent={{ enabled: showToc }}
      tableOfContentPopover={{ enabled: showToc }}
      toc={showToc ? toc : []}
    >
      <header className={cn('flex flex-col gap-3 border-b border-foreground/5 pb-8', gutter)}>
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
          <p className="label-mono text-foreground/45">
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

      <ConstructionBanner className={cn('my-2', gutter)} />

      {page.data.preview && (
        <div className="flex flex-col gap-12">
          {examples.map((example) => (
            <section className={cn('flex flex-col gap-4', gutter)} key={example.name}>
              {examples.length > 1 && (
                <div className="flex flex-col gap-1">
                  <SectionHeading id={example.name} title={example.title} />
                  {example.description && (
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  )}
                </div>
              )}
              <Preview path={example.slug} type={type} />
            </section>
          ))}
          <section className={cn('flex flex-col gap-4', gutter)}>
            <SectionHeading id="installation" title="Installation" />
            <RegistryInstall explorer={isTemplate} path={page.data.preview} />
          </section>
        </div>
      )}

      {/* Templates are the point of their index: show them before any prose. */}
      {isTemplate && galleryItems.length > 0 && (
        <section aria-labelledby="templates-gallery" className="flex flex-col">
          <h2 className="sr-only" id="templates-gallery">
            Templates disponibles
          </h2>
          <p className={cn('label-mono pb-3 text-foreground/45', gutter)}>
            {galleryItems.length} templates
          </p>
          <RegistryGrid
            className="border-s border-t border-foreground/5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
            items={galleryItems}
            variant="wide"
          />
        </section>
      )}

      {/* Text measure capped at ~68 characters; wider content (previews, tables) is untouched. */}
      <DocsBody className={cn('[&>:is(p,ul,ol,blockquote,h2,h3,h4)]:max-w-[68ch]', gutter)}>
        <MDX
          components={{
            ...defaultMdxComponents,
            Preview,
            PrimitivePreview,
          }}
        />
      </DocsBody>

      {!isTemplate && galleryItems.length > 0 && (
        <RegistryGrid
          className="border-s border-t border-foreground/5 xl:grid-cols-2 2xl:grid-cols-3"
          items={galleryItems}
        />
      )}
    </DocsPage>
  );
};
