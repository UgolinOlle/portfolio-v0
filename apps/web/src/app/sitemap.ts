import type { MetadataRoute } from 'next';

import {
  languageAlternates,
  LOCALES,
  LOCALIZED_CONTENT_PATH,
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
import { getStaticRoutes } from '~/lib/static-routes';

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;
type SitemapEntry = MetadataRoute.Sitemap[number];

const absolute = (path: string) => `${siteConfig.url}${path}`;

/** Frontmatter dates are free-form strings: an unparseable one must not crash sitemap generation. */
const parseDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
};

const registryRoutes = (source: RegistrySource): MetadataRoute.Sitemap =>
  source.getPages().map((page) => ({
    url: absolute(page.url),
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
  projectsSource
    .getPages()
    .flatMap((page) =>
      localizedRoutes(
        `/projects/${page.slugs.join('/')}`,
        getPageLocales(projectsSource, page.slugs),
        {},
      ),
    );

const writingRoutes = (): MetadataRoute.Sitemap =>
  writingsSource.getPages().flatMap((page) =>
    localizedRoutes(
      `/writings/${page.slugs.join('/')}`,
      getPageLocales(writingsSource, page.slugs),
      {
        lastModified: parseDate(page.data.updated ?? page.data.date),
      },
    ),
  );

export const dynamic = 'force-static';

/** Static pages come from the app directory; `/ui/*` index pages are listed by the registry sources. */
const staticRoutes = (): MetadataRoute.Sitemap =>
  getStaticRoutes().flatMap((pathname) =>
    LOCALIZED_CONTENT_PATH.test(pathname)
      ? localizedRoutes(pathname, LOCALES, {})
      : [{ url: absolute(pathname === '/' ? '' : pathname) }],
  );

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...staticRoutes(),
    ...projectRoutes(),
    ...writingRoutes(),
    ...registryRoutes(componentsSource),
    ...registryRoutes(blocksSource),
    ...registryRoutes(templatesSource),
  ];

  // Registry index pages (e.g. /ui/components) exist as both a static page and a source page.
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
