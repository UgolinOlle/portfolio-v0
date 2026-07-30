import type { MetadataRoute } from 'next';

import { siteConfig } from '~/lib/metadata';
import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;

const registryRoutes = (source: RegistrySource): MetadataRoute.Sitemap =>
  source.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/ui`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/inspirations`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...registryRoutes(componentsSource),
    ...registryRoutes(blocksSource),
    ...registryRoutes(templatesSource),
  ];
}
