import { cn } from '@portfolio-v0/shadcn/utils';

import {
  Apple,
  Bolt,
  Bot,
  Building2,
  Command,
  Component as ComponentIcon,
  HomeIcon,
  House,
  Palette,
  User,
  Users,
} from 'lucide-react';

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
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ugolin-olle',
    favicon: 'https://static.licdn.com/aero-v1/sc/h/90y3av2ns08iojcadywbxioqh',
    preview: {
      kind: 'linkedin',
      name: 'Ugolin Ollé',
      handle: '@ugolin-olle',
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
    favicon: 'https://dam.malt.com/favicon.png',
    preview: {
      kind: 'malt',
      name: 'Ugolin Ollé',
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
      bio: "Développeur, partage de builds et d'expérimentations frontend.",
    },
  },
  {
    label: 'NPM',
    link: 'https://www.npmjs.com/~whoa-studio',
    icon: LOGOS.NPM,
    preview: {
      kind: 'generic',
      name: 'Whoa Studio',
      handle: '@whoa-studio',
      bio: 'Packages publiés et maintenus sur npm.',
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
    icon: HomeIcon,
    id: 'maia-host',
  },
  {
    company: 'Digital Creator',
    title: 'Developer Full Stack',
    start: '2025',
    link: 'https://digitalcreator.app/',
    logo: 'https://digitalcreator.app/favicon.ico?favicon.4b4ac5f9.ico',
    icon: Palette,
    id: 'digital-creator',
  },
  {
    company: 'Sugar AI',
    title: 'Developer Backend',
    start: '2025',
    link: 'https://sugarai.app/',
    logo: 'https://www.sugarai.app/favicon-16x16.png',
    icon: Apple,
    id: 'sugar-ai',
  },
  {
    company: 'Le Boutiquier',
    title: 'Developer Full Stack / Support technique',
    start: '2024',
    end: '2025',
    link: 'https://leboutiquier.fr/',
    logo: 'https://res.cloudinary.com/djher1fiu/image/upload/v1758012423/xop0sw1gbaky4eiicifj.png',
    icon: House,
    id: 'le-boutiquier',
  },
  {
    company: 'Connectra',
    title: 'Developer Front-end',
    start: '2024',
    link: '',
    logo: '/assets/logos/connectra_logo.webp',
    icon: Bolt,
    id: 'connectra',
  },
  {
    company: 'ComAI',
    title: 'Developer Full Stack',
    start: '2024',
    link: '',
    icon: Bot,
    id: 'comai',
  },
  {
    company: 'Freelance',
    title: 'Developer Full Stack',
    start: '2021',
    end: 'Present',
    link: 'https://ugolin-olle.com',
    logo: '/favicon.ico',
    icon: User,
    id: 'freelance',
  },
  {
    company: 'Azerty Consulting',
    title: 'Developer Full Stack',
    start: '2022',
    end: '2023',
    link: 'https://azertyconsulting.fr/',
    logo: 'https://azertyconsulting.fr/icon.png?27ebc0b5cfa491cd',
    icon: Users,
    id: 'azerty-consulting',
  },
  {
    company: 'Nicoka',
    title: 'Back-end Developer (Stage)',
    start: '2022',
    link: 'https://nicoka.com',
    logo: 'https://www.nicoka.com/assets/img/favicon.ico',
    icon: Building2,
    id: 'nicoka',
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
