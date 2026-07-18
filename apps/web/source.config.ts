import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

const registrySchema = frontmatterSchema.extend({
  preview: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
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

export default defineConfig();
