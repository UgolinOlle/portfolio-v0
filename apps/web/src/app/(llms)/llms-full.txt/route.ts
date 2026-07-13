import { blocksSource, componentsSource, getLLMText, templatesSource } from '~/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = [
    ...componentsSource.getPages(),
    ...blocksSource.getPages(),
    ...templatesSource.getPages(),
  ];
  const scanned = await Promise.all(pages.map(getLLMText));

  return new Response(scanned.join('\n\n'));
}
