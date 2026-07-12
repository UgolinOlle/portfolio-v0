export const defaultViewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const defaultMetadata = {
  title: {
    default: "Hey, I'm Ugolin Ollé, Full Stack Developer & SaaS Creator",
    template: '%s | Ugolin Ollé',
  },
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
  authors: [
    {
      name: 'Ugolin Ollé',
      url: 'https://ugolin-olle.com',
    },
  ],
  publisher: 'Ugolin Ollé',
  creator: 'Ugolin Ollé',
  openGraph: {
    title: 'Ugolin Ollé - Développeur Full Stack & Créateur de SaaS',
    description:
      'Développement sur mesure de SaaS, landing pages optimisées et solutions performantes pour startups et indépendants ambitieux.',
    url: 'https://ugolin-olle.com',
    siteName: 'Ugolin Ollé',
    images: [
      {
        url: 'https://ugolin-olle.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ugolin Ollé - Développeur Full Stack',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ugolin Ollé - Développeur Full Stack & Créateur de SaaS',
    description:
      'Développement sur mesure de SaaS, landing pages optimisées et solutions performantes pour startups et indépendants ambitieux.',
    creator: '@ugolinolle',
    images: ['https://ugolin-olle.com/og-image.png'],
  },
  metadataBase: new URL('https://ugolin-olle.com'),
  alternates: {
    canonical: 'https://ugolin-olle.com',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};
