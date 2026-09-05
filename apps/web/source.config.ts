import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

const registrySchema = frontmatterSchema.extend({
  preview: z.string().optional(),
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

export const { docs: projectsDocs, meta: projectsMeta } = defineDocs({
  dir: 'content/projects',
  docs: { schema: frontmatterSchema },
});

const writingsSchema = frontmatterSchema.extend({
  date: z.string(),
  category: z.string(),
});

export const { docs: writingsDocs, meta: writingsMeta } = defineDocs({
  dir: 'content/writings',
  docs: { schema: writingsSchema },
});

export default defineConfig();
