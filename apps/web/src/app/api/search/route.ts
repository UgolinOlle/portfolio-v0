import { createFromSource } from 'fumadocs-core/search/server';
import type { NextRequest } from 'next/server';

import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

const componentsSearch = createFromSource(componentsSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

const blocksSearch = createFromSource(blocksSource, {
  language: 'english',
});

const templatesSearch = createFromSource(templatesSource, {
  language: 'english',
});

export async function GET(req: NextRequest) {
  const [componentsResponse, blocksResponse, templatesResponse] = await Promise.all([
    componentsSearch.GET(req),
    blocksSearch.GET(req),
    templatesSearch.GET(req),
  ]);

  const [componentsResults, blocksResults, templatesResults] = await Promise.all([
    componentsResponse.json(),
    blocksResponse.json(),
    templatesResponse.json(),
  ]);

  const results = [
    ...(Array.isArray(componentsResults) ? componentsResults : []),
    ...(Array.isArray(blocksResults) ? blocksResults : []),
    ...(Array.isArray(templatesResults) ? templatesResults : []),
  ];

  return Response.json(results);
}
