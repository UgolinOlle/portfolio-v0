import { llms } from 'fumadocs-core/source';

import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

export const revalidate = false;

export function GET() {
  const componentsIndex = llms(componentsSource).index();
  const blocksIndex = llms(blocksSource).index();
  const templatesIndex = llms(templatesSource).index();

  return new Response(`${componentsIndex}\n\n${blocksIndex}\n\n${templatesIndex}`);
}
