import type { Metadata, Viewport } from 'next';

export const siteConfig = {
  name: 'Ugolin Ollé',
  url: 'https://ugolin-olle.com',
  title: 'Ugolin Ollé — Développeur full stack freelance Next.js',
  description:
    'Développeur full stack freelance : SaaS, applications web et landing pages rapides avec Next.js, React, NestJS et TypeScript. Disponible pour vos projets.',
  keywords: [
    'Ugolin Ollé',
    'Développeur full stack freelance',
    'Développeur Next.js freelance',
    'Développeur React freelance',
    'Création de SaaS',
    'Landing page',
    'Next.js',
    'NestJS',
    'TypeScript',
  ],
  locale: 'fr_FR',
  alternateLocale: 'en_US',
  ogImage: '/og.png',
  profileImage: '/assets/profile.png',
  email: 'hello@ugolin-olle.com',
  socials: {
    twitter: '@ugolin_olle',
    x: 'https://x.com/ugolin_olle',
    github: 'https://github.com/UgolinOlle',
    linkedin: 'https://www.linkedin.com/in/ugolin-olle',
    malt: 'https://www.malt.fr/profile/ugolinolle',
  },
} as const;

export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: siteConfig.alternateLocale,
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.socials.twitter,
    creator: siteConfig.socials.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };

export const resolveLocale = (lang: string | undefined): Locale =>
  LOCALES.includes(lang as Locale) ? (lang as Locale) : DEFAULT_LOCALE;

/** EN variants of projects and writings are served on the same path with `?lang=en`. */
export const localizedPath = (pathname: string, lang: Locale): string =>
  lang === DEFAULT_LOCALE ? pathname : `${pathname}?lang=${lang}`;

/** `hreflang` map for a page available in `languages`, with the default locale as `x-default`. */
export const languageAlternates = (
  pathname: string,
  languages: readonly Locale[],
): Record<string, string> =>
  Object.fromEntries([
    ...languages.map((lang) => [lang, localizedPath(pathname, lang)]),
    ['x-default', localizedPath(pathname, DEFAULT_LOCALE)],
  ]);

type PageMetadataInput = {
  /** Plain page title, the global template (`%s | Ugolin Ollé`) is applied automatically to <title>. */
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. `/ui` or `/inspirations`. */
  pathname: string;
  image?: string;
  /** Locale of the rendered content. Non-default locales get a self-referencing `?lang=` canonical. */
  lang?: Locale;
  /** Locales this page exists in. When more than one, `hreflang` alternates are emitted. */
  languages?: readonly Locale[];
  /** Publication date (ISO) for articles: switches og:type to `article`. */
  publishedTime?: string;
};

/**
 * Next.js does not deep-merge `openGraph`/`twitter` objects down the layout tree — a page that
 * sets either one replaces it entirely. Every field a social preview needs (siteName, locale,
 * card type, ...) is therefore re-specified here instead of relying on inheritance from the root.
 */
export const createMetadata = ({
  title,
  description = siteConfig.description,
  pathname,
  image = siteConfig.ogImage,
  lang = DEFAULT_LOCALE,
  languages = [DEFAULT_LOCALE],
  publishedTime,
}: PageMetadataInput): Metadata => {
  const url = localizedPath(pathname, lang);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(languages.length > 1 && { languages: languageAlternates(pathname, languages) }),
    },
    openGraph: {
      ...(publishedTime
        ? { type: 'article', publishedTime, authors: [siteConfig.url] }
        : { type: 'website' }),
      locale: OG_LOCALES[lang],
      alternateLocale: languages.filter((l) => l !== lang).map((l) => OG_LOCALES[l]),
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.socials.twitter,
      creator: siteConfig.socials.twitter,
      title,
      description,
      images: [image],
    },
  };
};

export type RegistryKind = 'components' | 'blocks' | 'templates';

/** Search titles for the registry: bare names ("Button", "Introduction") say nothing in a SERP. */
const REGISTRY_TITLES: Record<RegistryKind, { index: string; item: (name: string) => string }> = {
  components: {
    index: 'Composants React pour shadcn/ui',
    item: (name) => `${name} : composant React pour shadcn/ui`,
  },
  blocks: {
    index: 'Blocks React et Next.js pour shadcn/ui',
    item: (name) => `${name} : block React pour shadcn/ui`,
  },
  templates: {
    index: 'Templates Next.js pour shadcn/ui',
    item: (name) => `${name} : template Next.js`,
  },
};

type DocsMetadataInput = {
  kind: RegistryKind;
  /** True for the section's index page (`/ui/components`, ...). */
  isIndex: boolean;
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. `/ui/components/button`. */
  pathname: string;
  /** Path to the generated OG image for this doc page, e.g. `/og/docs/components/button/image.png`. */
  ogImage: string;
};

/** Shared metadata builder for the components/blocks/templates registry doc pages. */
export const createDocsMetadata = ({
  kind,
  isIndex,
  title,
  description,
  pathname,
  ogImage,
}: DocsMetadataInput): Metadata =>
  createMetadata({
    title: isIndex ? REGISTRY_TITLES[kind].index : REGISTRY_TITLES[kind].item(title),
    description,
    pathname,
    image: ogImage,
  });
