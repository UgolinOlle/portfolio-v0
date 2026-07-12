import { blocksSource, componentsSource, getLLMText } from '~/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = [...componentsSource.getPages(), ...blocksSource.getPages()];
  const scanned = await Promise.all(pages.map(getLLMText));

  return new Response(scanned.join('\n\n'));
}
