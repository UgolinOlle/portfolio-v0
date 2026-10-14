import { DEFAULT_LOCALE, type Locale, localizedPath, siteConfig } from '~/lib/metadata';

/**
 * schema.org JSON-LD builders. Entities reference each other by `@id` so Google can merge the
 * Person described on the home page with the author of every article and project.
 */

const absolute = (path: string) => `${siteConfig.url}${path}`;

export const PERSON_ID = `${siteConfig.url}/#person`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

const personRef = { '@id': PERSON_ID };

export const personSchema = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: siteConfig.name,
  url: siteConfig.url,
  image: absolute(siteConfig.profileImage),
  email: `mailto:${siteConfig.email}`,
  jobTitle: 'Développeur full stack freelance',
  description: siteConfig.description,
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'NestJS',
    'Tailwind CSS',
    'PostgreSQL',
    'SaaS',
    'Docker',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: '42',
    url: 'https://42.fr',
  },
  sameAs: [
    siteConfig.socials.github,
    siteConfig.socials.linkedin,
    siteConfig.socials.malt,
    siteConfig.socials.x,
  ],
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: ['fr', 'en'],
  publisher: personRef,
});

/** Home page: a ProfilePage about the Person, inside the WebSite. */
export const homeSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    personSchema(),
    websiteSchema(),
    {
      '@type': 'ProfilePage',
      '@id': `${siteConfig.url}/#profile`,
      url: siteConfig.url,
      name: siteConfig.title,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: personRef,
      inLanguage: DEFAULT_LOCALE,
    },
  ],
});

type Crumb = { name: string; path: string };

const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: siteConfig.name, path: '' }, ...crumbs].map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absolute(crumb.path),
  })),
});

type ArticleInput = {
  title: string;
  description?: string;
  pathname: string;
  lang: Locale;
  datePublished: string;
};

export const articleSchema = ({
  title,
  description,
  pathname,
  lang,
  datePublished,
}: ArticleInput) => {
  const url = absolute(localizedPath(pathname, lang));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: title,
        description,
        url,
        mainEntityOfPage: url,
        datePublished,
        inLanguage: lang,
        author: personRef,
        publisher: personRef,
        isPartOf: { '@id': WEBSITE_ID },
        image: absolute(siteConfig.ogImage),
      },
      breadcrumbSchema([
        { name: lang === 'en' ? 'Writings' : 'Articles', path: '/writings' },
        { name: title, path: localizedPath(pathname, lang) },
      ]),
    ],
  };
};

type ProjectInput = {
  title: string;
  description?: string;
  pathname: string;
  lang: Locale;
};

export const projectSchema = ({ title, description, pathname, lang }: ProjectInput) => {
  const url = absolute(localizedPath(pathname, lang));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        name: title,
        description,
        url,
        inLanguage: lang,
        author: personRef,
        creator: personRef,
        isPartOf: { '@id': WEBSITE_ID },
      },
      // No /projects index page exists, so the trail goes straight from home to the project.
      breadcrumbSchema([{ name: title, path: localizedPath(pathname, lang) }]),
    ],
  };
};
