import type { MetadataRoute } from 'next';

import {
  languageAlternates,
  LOCALES,
  localizedPath,
  siteConfig,
  type Locale,
} from '~/lib/metadata';
import {
  blocksSource,
  componentsSource,
  getPageLocales,
  projectsSource,
  templatesSource,
  writingsSource,
} from '~/lib/source';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;
type SitemapEntry = MetadataRoute.Sitemap[number];

const absolute = (path: string) => `${siteConfig.url}${path}`;

const registryRoutes = (source: RegistrySource): MetadataRoute.Sitemap =>
  source.getPages().map((page) => ({
    url: absolute(page.url),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

/** One entry per available locale, each listing every translation as an `hreflang` alternate. */
const localizedRoutes = (
  pathname: string,
  languages: readonly Locale[],
  entry: Omit<SitemapEntry, 'url' | 'alternates'>,
): MetadataRoute.Sitemap => {
  const alternates =
    languages.length > 1
      ? {
          languages: Object.fromEntries(
            Object.entries(languageAlternates(pathname, languages)).map(([lang, path]) => [
              lang,
              absolute(path),
            ]),
          ),
        }
      : undefined;

  return languages.map((lang) => ({
    ...entry,
    url: absolute(localizedPath(pathname, lang)),
    alternates,
  }));
};

const projectRoutes = (): MetadataRoute.Sitemap =>
  projectsSource.getPages().flatMap((page) =>
    localizedRoutes(
      `/projects/${page.slugs.join('/')}`,
      getPageLocales(projectsSource, page.slugs),
      {
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ),
  );

const writingRoutes = (): MetadataRoute.Sitemap =>
  writingsSource.getPages().flatMap((page) =>
    localizedRoutes(
      `/writings/${page.slugs.join('/')}`,
      getPageLocales(writingsSource, page.slugs),
      {
        lastModified: new Date(page.data.date),
        changeFrequency: 'yearly',
        priority: 0.7,
      },
    ),
  );

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'monthly', priority: 1 },
    ...localizedRoutes('/writings', LOCALES, { changeFrequency: 'weekly', priority: 0.7 }),
    { url: absolute('/ui'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absolute('/inspirations'), changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...projectRoutes(),
    ...writingRoutes(),
    ...registryRoutes(componentsSource),
    ...registryRoutes(blocksSource),
    ...registryRoutes(templatesSource),
  ];
}
