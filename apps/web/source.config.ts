import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

const registrySchema = frontmatterSchema.extend({
  preview: z.string().optional(),
  /** Width (px) the block is designed at; its grid thumbnail is scaled from it. Defaults to a full page. */
  previewWidth: z.number().int().positive().optional(),
  /** `fill`: the demo covers the whole preview panel, edge to edge, without padding or dot grid. */
  previewFit: z.enum(['frame', 'fill']).optional(),
  /** The block sizes itself on its parent (`w-full`, container queries): its thumbnail renders it at `previewWidth` instead of shrink-wrapping it. */
  previewFluid: z.boolean().optional(),
  /** Shown first and twice as wide in the /ui grid: the showcase item of its category. */
  featured: z.boolean().optional(),
});

export const { docs: componentsDocs, meta: componentsMeta } = defineDocs({
  dir: 'content/components',
  docs: { schema: registrySchema },
});

export const { docs: blocksDocs, meta: blocksMeta } = defineDocs({
  dir: 'content/blocks',
  docs: { schema: registrySchema },
});

export const { docs: templatesDocs, meta: templatesMeta } = defineDocs({
  dir: 'content/templates',
  docs: { schema: registrySchema },
});

const projectsSchema = frontmatterSchema.extend({
  /** Search-result title when it should say more than the H1 (e.g. product name + what it is). */
  seoTitle: z.string().optional(),
  /** Short tech list shown in the project header (only what the page itself documents). */
  stack: z.array(z.string()).optional(),
  /** External links shown in the project header (site, repository...). */
  links: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
});

export const { docs: projectsDocs, meta: projectsMeta } = defineDocs({
  dir: 'content/projects',
  docs: { schema: projectsSchema },
});

const writingsSchema = frontmatterSchema.extend({
  date: z.string(),
  category: z.string(),
});

export const { docs: writingsDocs, meta: writingsMeta } = defineDocs({
  dir: 'content/writings',
  docs: { schema: writingsSchema },
});

export default defineConfig({
  mdxOptions: {
    // ```mermaid code blocks become <Mermaid chart="..." /> (see components/core/mermaid.tsx).
    remarkPlugins: (plugins) => [remarkMdxMermaid, ...plugins],
  },
});
