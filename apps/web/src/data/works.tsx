import type { WorkExperience } from '~/types';

/** Newest start first. Descriptions are generic placeholders derived from each role. */
export const WORKS_EXPERIENCES: WorkExperience[] = [
  {
    company: 'Maia',
    title: 'Developer Full Stack',
    description: {
      fr: "Développement full stack, de l'interface à l'API.",
      en: 'Full stack development, from interface to API.',
    },
    start: '2025',
    link: 'https://maia-host.com',
    logo: '/assets/logos/maia-host.png',
    id: 'maia-host',
  },
  {
    company: 'Digital Creator',
    title: 'Developer Full Stack',
    description: {
      fr: 'Développement full stack de produits web.',
      en: 'Full stack development of web products.',
    },
    start: '2025',
    link: 'https://digitalcreator.app/',
    logo: '/assets/logos/digital-creator.png',
    id: 'digital-creator',
  },
  {
    company: 'Sugar AI',
    title: 'Developer Backend',
    description: {
      fr: 'Conception et développement de services back-end.',
      en: 'Designing and building back-end services.',
    },
    start: '2025',
    link: 'https://sugarai.app/',
    logo: '/assets/logos/sugar-ai.png',
    id: 'sugar-ai',
  },
  {
    company: 'Le Boutiquier',
    title: 'Developer Full Stack / Support technique',
    description: {
      fr: 'Développement full stack et support technique.',
      en: 'Full stack development and technical support.',
    },
    start: '2024',
    end: '2025',
    link: 'https://leboutiquier.fr/',
    logo: '/assets/logos/le-boutiquier.png',
    id: 'le-boutiquier',
  },
  {
    company: 'Connectra',
    title: 'Developer Front-end',
    description: {
      fr: "Développement d'interfaces front-end.",
      en: 'Building front-end interfaces.',
    },
    start: '2024',
    link: '',
    logo: '/assets/logos/connectra_logo.webp',
    id: 'connectra',
  },
  {
    company: 'ComAI',
    title: 'Developer Full Stack',
    description: {
      fr: 'Développement full stack de produits web.',
      en: 'Full stack development of web products.',
    },
    start: '2024',
    link: '',
    id: 'comai',
  },
  {
    company: 'Azerty Consulting',
    title: 'Developer Full Stack',
    description: {
      fr: 'Développement full stack pour des clients en conseil.',
      en: 'Full stack development for consulting clients.',
    },
    start: '2022',
    end: '2023',
    link: 'https://azertyconsulting.fr/',
    logo: '/assets/logos/azerty-consulting.png',
    id: 'azerty-consulting',
  },
  {
    company: 'Nicoka',
    title: 'Back-end Developer (Stage)',
    description: {
      fr: 'Stage de développement back-end.',
      en: 'Back-end development internship.',
    },
    start: '2022',
    link: 'https://nicoka.com',
    logo: '/assets/logos/nicoka.png',
    id: 'nicoka',
  },
  {
    company: 'Freelance',
    title: 'Developer Full Stack',
    description: {
      fr: 'Sites et applications sur mesure pour des clients.',
      en: 'Custom websites and apps for clients.',
    },
    current: true,
    start: '2021',
    end: 'Present',
    link: 'https://ugolin-olle.com',
    logo: '/assets/logos/freelance.png',
    id: 'freelance',
  },
];
