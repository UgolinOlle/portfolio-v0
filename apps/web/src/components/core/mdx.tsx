import { File, Files, Folder } from 'fumadocs-ui/components/files';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { Mermaid } from '~/components/core/mermaid';
import { Screenshots } from '~/components/projects/screenshots';
import { TechStack } from '~/components/projects/tech-stack';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    File,
    Files,
    Folder,
    Mermaid,
    Screenshots,
    TechStack,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
