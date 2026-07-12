import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import {
  blocksDocs,
  blocksMeta,
  componentsDocs,
  componentsMeta,
} from 'fumadocs-mdx:collections/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';

const icon = (name: string | undefined) => {
  if (!name) {
    return;
  }

  if (name in icons) {
    return createElement(icons[name as keyof typeof icons]);
  }
};

export const componentsSource = loader({
  baseUrl: '/ui/components',
  source: toFumadocsSource(componentsDocs, componentsMeta),
  icon,
});

export const blocksSource = loader({
  baseUrl: '/ui/blocks',
  source: toFumadocsSource(blocksDocs, blocksMeta),
  icon,
});

type RegistryPage =
  | ReturnType<typeof componentsSource.getPages>[number]
  | ReturnType<typeof blocksSource.getPages>[number];

export const getLLMText = async (page: RegistryPage) => {
  const raw = await page.data.getText('raw');

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description ?? ''}

${raw}`;
};
