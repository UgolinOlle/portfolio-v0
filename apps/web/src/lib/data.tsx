import { cn } from '@portfolio-v0/shadcn/utils';

import { BookOpenText, Command, Component as ComponentIcon, SquareTerminal } from 'lucide-react';

import { LOGOS, TOOLS } from '~/components/icons';
import type { Project, Resources, SocialLink, WorkExperience } from '~/types';

export const PROJECTS: Project[] = [
  {
    name: 'Whoa UI Components',
    description:
      "Composants d'interface animés conçus pour React et Next.js. (Projet en construction)",
    link: '/ui',
    id: 'whoa-ui',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl border border-zinc-200 bg-white shadow',
            'transition-transform duration-300 group-hover:rotate-45',
            'dark:border-zinc-700 dark:bg-zinc-950/40',
          )}
        />

        <div className="relative flex size-full items-center justify-center">
          <ComponentIcon className="size-7" />
        </div>
      </div>
    ),
  },
  {
    name: 'Whoa Stash',
    description: 'Application MacOS pour gérer le son.',
    link: '/projects/whoa-stash',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl border border-zinc-200 bg-white shadow',
            'transition-transform duration-300 group-hover:rotate-45',
            'dark:border-zinc-700 dark:bg-zinc-950/40',
          )}
        />

        <div className="relative flex size-full items-center justify-center">
          <Command className="size-7" />
        </div>
      </div>
    ),
    id: 'whoa-stash',
  },
  {
    name: 'Neovim Config',
    description: 'Configuration Neovim pour le développement web.',
    link: '/projects/neovim',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl border border-zinc-200 bg-white shadow',
            'transition-transform duration-300 group-hover:rotate-45',
            'dark:border-zinc-700 dark:bg-zinc-950/40',
          )}
        />

        <div className="relative flex size-full items-center justify-center">
          <SquareTerminal className="size-7" />
        </div>
      </div>
    ),
    id: 'neovim-config',
  },
  {
    name: '42 Bangkok',
    description:
      "Projets réalisés à l'école 42, incluant des applications web et des outils internes.",
    link: '/projects/42',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl border border-zinc-200 bg-white shadow',
            'transition-transform duration-300 group-hover:rotate-45',
            'dark:border-zinc-700 dark:bg-zinc-950/40',
          )}
        />

        <div className="relative flex size-full items-center justify-center">
          <BookOpenText className="size-7" />
        </div>
      </div>
    ),
    id: '42',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ugolin-olle',
    icon: LOGOS.LinkedIn,
    preview: {
      kind: 'linkedin',
      name: 'Ugolin Ollé',
      handle: '@ugolin-olle',
      avatar:
        'https://media.licdn.com/dms/image/v2/D4E35AQHfN9OIs0vNcQ/profile-framedphoto-shrink_800_800/B4EZ_WrubXHkAY-/0/1786013214882?e=1787670000&v=beta&t=LDNTeVmDxiqV1pGarls1vdFWNKZv8kptRWEw_v-CCP8',
      role: 'Développeur Full Stack freelance',
      bio: 'Expériences produit, sites vitrines et outils sur-mesure.',
    },
  },
  {
    label: 'Github',
    link: 'https://github.com/UgolinOlle',
    icon: LOGOS.GithubLight,
    iconDark: LOGOS.GithubDark,
    preview: {
      kind: 'github',
      name: 'Ugolin Ollé',
      handle: '@UgolinOlle',
      avatar: 'https://github.com/UgolinOlle.png',
      bio: 'Composants, expérimentations et side-projects open source.',
      stats: [
        { label: 'Repos', value: '20+' },
        { label: 'Followers', value: '15+' },
      ],
    },
  },
  {
    label: 'Malt',
    link: 'https://www.malt.fr/profile/ugolinolle',
    icon: LOGOS.Malt,
    preview: {
      kind: 'malt',
      name: 'Ugolin Ollé',
      avatar:
        'https://dam.malt.com/07c65f24-a1b7-4895-a8af-9a10e1425dc6?gravity=face&func=face&face_margin=70&w=360&h=360&force_format=webp',
      role: 'Développeur Full Stack',
      bio: 'Disponible pour des missions freelance en développement web.',
    },
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/ugolin_olle',
    icon: LOGOS.XLight,
    iconDark: LOGOS.XDark,
    preview: {
      kind: 'twitter',
      name: 'Ugolin Ollé',
      handle: '@ugolin_olle',
      avatar: 'https://pbs.twimg.com/profile_images/1959181504485150721/7pyz6ZFZ_400x400.jpg',
      bio: "Développeur, partage de builds et d'expérimentations frontend.",
    },
  },
];

export const RESOURCES: Resources[] = [
  {
    name: 'MacBook Pro M4',
    type: 'Matériel',
    color: '#F7AB0A',
    url: '/assets/uses/macbook.jpeg',
  },
  {
    name: 'Keychboard Keychron K3',
    type: 'Matériel',
    color: '#F7AB0A',
    url: '/assets/uses/keychron.webp',
  },
  { name: 'Notion', type: 'App', color: '#6366F1', icon: TOOLS.Notion },
  { name: 'Raycast', type: 'App', color: '#6366F1', icon: TOOLS.Raycast },
  { name: 'Discord', type: 'App', color: '#6366F1', icon: TOOLS.Discord },
  { name: 'Figma', type: 'App', color: '#6366F1', icon: TOOLS.Figma },
  {
    name: 'Ghostty',
    type: 'App',
    color: '#6366F1',
    icon: TOOLS.Ghostty,
  },
  {
    name: 'TablePlus',
    type: 'App',
    color: '#6366F1',
    url: '/assets/logos/table-plus.png',
  },
  { name: 'VSCode', type: 'IDE', color: '#EF4444', icon: TOOLS.VSCode },
  { name: 'Neovim', type: 'IDE', color: '#EF4444', icon: TOOLS.Neovim },
];

export const WORKS_EXPERIENCES: WorkExperience[] = [
  {
    company: 'Maia',
    title: 'Developer Full Stack',
    start: '2025',
    link: 'https://maia-host.com',
    logo: '/assets/logos/maia-host.png',
    id: 'maia-host',
    details: {
      fr: [
        'Développement de fonctionnalités full-stack pour une plateforme web.',
        "Contribution aux choix techniques et à l'amélioration continue du produit.",
      ],
      en: [
        'Developed full-stack features for a web platform.',
        'Contributed to technical decisions and continuous product improvement.',
      ],
    },
  },
  {
    company: 'Digital Creator',
    title: 'Developer Full Stack',
    start: '2025',
    link: 'https://digitalcreator.app/',
    logo: 'https://digitalcreator.app/favicon.ico?favicon.4b4ac5f9.ico',
    id: 'digital-creator',
    details: {
      fr: [
        "Développement d'outils web orientés création et gestion de contenu.",
        "Participation à la conception d'interfaces et de fonctionnalités produit.",
      ],
      en: [
        'Developed web tools focused on content creation and management.',
        'Contributed to interface design and product feature development.',
      ],
    },
  },
  {
    company: 'Sugar AI',
    title: 'Developer Backend',
    start: '2025',
    link: 'https://sugarai.app/',
    logo: 'https://www.sugarai.app/favicon-16x16.png',
    id: 'sugar-ai',
    details: {
      fr: [
        'Développement backend et intégration de services pour une application IA.',
        'Travail sur la fiabilité des échanges entre les différents composants.',
      ],
      en: [
        'Developed backend features and service integrations for an AI application.',
        'Worked on the reliability of communication between application components.',
      ],
    },
  },
  {
    company: 'Le Boutiquier',
    title: 'Developer Full Stack / Support technique',
    start: '2024',
    end: '2025',
    link: 'https://leboutiquier.fr/',
    logo: 'https://res.cloudinary.com/djher1fiu/image/upload/v1758012423/xop0sw1gbaky4eiicifj.png',
    id: 'le-boutiquier',
    details: {
      fr: [
        'Développement et maintenance de fonctionnalités full-stack.',
        "Support technique et résolution de problèmes rencontrés par les utilisateurs.",
      ],
      en: [
        'Developed and maintained full-stack features.',
        'Provided technical support and resolved user-facing issues.',
      ],
    },
  },
  {
    company: 'Connectra',
    title: 'Developer Front-end',
    start: '2024',
    link: '',
    logo: '/assets/logos/connectra_logo.webp',
    id: 'connectra',
    details: {
      fr: [
        "Développement d'interfaces web et intégration de fonctionnalités frontend.",
        "Amélioration de l'expérience utilisateur et de la qualité du code.",
      ],
      en: [
        'Developed web interfaces and integrated frontend features.',
        'Improved user experience and code quality.',
      ],
    },
  },
  {
    company: 'ComAI',
    title: 'Developer Full Stack',
    start: '2024',
    link: '',
    id: 'comai',
    details: {
      fr: [
        'Développement de fonctionnalités full-stack pour un produit web.',
        "Collaboration sur la conception et l'évolution de l'application.",
      ],
      en: [
        'Developed full-stack features for a web product.',
        "Collaborated on the application's design and evolution.",
      ],
    },
  },
  {
    company: 'Freelance',
    title: 'Developer Full Stack',
    start: '2021',
    end: 'Present',
    link: 'https://ugolin-olle.com',
    logo: '/favicon.ico',
    id: 'freelance',
    details: {
      fr: [
        "Conception et développement de sites web et d'applications sur mesure.",
        "Accompagnement technique, de la définition du besoin au déploiement.",
      ],
      en: [
        'Designed and developed websites and custom applications.',
        'Provided technical support from requirements gathering through deployment.',
      ],
    },
  },
  {
    company: 'Azerty Consulting',
    title: 'Developer Full Stack',
    start: '2022',
    end: '2023',
    link: 'https://azertyconsulting.fr/',
    logo: 'https://azertyconsulting.fr/icon.png?27ebc0b5cfa491cd',
    id: 'azerty-consulting',
    details: {
      fr: [
        'Développement de fonctionnalités web full-stack pour différents projets clients.',
        'Adaptation à des contextes techniques et besoins métier variés.',
      ],
      en: [
        'Developed full-stack web features for different client projects.',
        'Adapted to varied technical contexts and business requirements.',
      ],
    },
  },
  {
    company: 'Nicoka',
    title: 'Back-end Developer (Stage)',
    start: '2022',
    link: 'https://nicoka.com',
    logo: 'https://www.nicoka.com/assets/img/favicon.ico',
    id: 'nicoka',
    details: {
      fr: [
        'Participation au développement backend pendant un stage.',
        "Découverte des pratiques de développement en équipe et de la maintenance applicative.",
      ],
      en: [
        'Contributed to backend development during an internship.',
        'Learned team development practices and application maintenance.',
      ],
    },
  },
];

export const INSPIRATIONS = [
  {
    name: 'Vercel',
    href: 'https://vercel.com',
    description:
      'Pour la simplicité des interfaces, les micro-interactions et le soin apporté aux détails.',
  },
  {
    name: 'Linear',
    href: 'https://linear.app',
    description: "Une référence pour les animations et l'expérience utilisateur.",
  },
  {
    name: 'shadcn/ui',
    href: 'https://ui.shadcn.com',
    description: 'Une excellente base de composants modernes et accessibles.',
  },
  {
    name: 'Aceternity UI',
    href: 'https://ui.aceternity.com',
    description: "Pour certaines idées d'animations et de compositions.",
  },
];
