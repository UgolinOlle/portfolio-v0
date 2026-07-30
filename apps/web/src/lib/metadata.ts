import type { Metadata, Viewport } from 'next';

export const siteConfig = {
  name: 'Ugolin Ollé',
  url: 'https://ugolin-olle.com',
  title: "Hey, I'm Ugolin Ollé, Full Stack Developer & SaaS Creator",
  description:
    'Développeur full stack freelance spécialisé dans la création de SaaS, landing pages performantes et expériences web sur mesure. Expert Next.js, Tailwind CSS, Framer Motion et NestJS.',
  keywords: [
    'Développeur web freelance',
    'Développeur full stack',
    'Création de SaaS',
    'Landing page',
    'Next.js',
    'NestJS',
    'Tailwind CSS',
    'Framer Motion',
    'SEO',
    'Performance web',
    'React developer',
    'Ugolin Ollé',
  ],
  locale: 'fr_FR',
  alternateLocale: 'en_US',
  ogImage: '/og.png',
  socials: {
    twitter: '@ugolin_olle',
    github: 'https://github.com/UgolinOlle',
    linkedin: 'https://www.linkedin.com/in/ugolin-olle',
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
  alternates: {
    canonical: '/',
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

type PageMetadataInput = {
  /** Plain page title, the global template (`%s | Ugolin Ollé`) is applied automatically to <title>. */
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. `/ui` or `/inspirations`. */
  pathname: string;
  image?: string;
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
}: PageMetadataInput): Metadata => ({
  title,
  description,
  alternates: {
    canonical: pathname,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: pathname,
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
});

type DocsMetadataInput = {
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. `/ui/components/button`. */
  pathname: string;
  /** Path to the generated OG image for this doc page, e.g. `/og/docs/components/button/image.png`. */
  ogImage: string;
};

/** Shared metadata builder for the components/blocks/templates registry doc pages. */
export const createDocsMetadata = ({
  title,
  description,
  pathname,
  ogImage,
}: DocsMetadataInput): Metadata => createMetadata({ title, description, pathname, image: ogImage });
