import { createFromSource } from 'fumadocs-core/search/server';
import type { NextRequest } from 'next/server';

import { blocksSource, componentsSource } from '~/lib/source';

const componentsSearch = createFromSource(componentsSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

const blocksSearch = createFromSource(blocksSource, {
  language: 'english',
});

export async function GET(req: NextRequest) {
  const [componentsResponse, blocksResponse] = await Promise.all([
    componentsSearch.GET(req),
    blocksSearch.GET(req),
  ]);

  const [componentsResults, blocksResults] = await Promise.all([
    componentsResponse.json(),
    blocksResponse.json(),
  ]);

  const results = [
    ...(Array.isArray(componentsResults) ? componentsResults : []),
    ...(Array.isArray(blocksResults) ? blocksResults : []),
  ];

  return Response.json(results);
}
