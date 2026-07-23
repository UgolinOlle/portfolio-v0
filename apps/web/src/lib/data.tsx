import { Command, Component as ComponentIcon } from 'lucide-react';

import { LOGOS, TOOLS } from '~/components/icons';
import type { Project, Resources, SocialLink, WorkExperience } from '~/utils/type';

/**
 * @constant PROJECTS
 * @description List of projects with their details
 * @type {Project[]}
 */
export const PROJECTS: Project[] = [
  {
    name: 'Whoa UI Components',
    description:
      "Composants d'interface animés conçus pour React et Next.js. (Projet en construction)",
    link: '/ui',
    id: 'whoa-ui',
    content: (
      <div className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow dark:border-zinc-700 dark:bg-zinc-950/40">
        <ComponentIcon className="size-7" />
      </div>
    ),
  },
  {
    name: 'Whoa Stash',
    description: 'Application MacOS pour gérer le son.',
    link: '/projects/whoa-stash',
    content: (
      <div className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow dark:border-zinc-700 dark:bg-zinc-950/40">
        <Command className="size-7" />
      </div>
    ),
    id: 'whoa-stash',
  },
];

/**
 * @constant SOCIAL_LINKS
 * @description List of social links with their details
 * @type {SocialLink[]}
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ugolin-olle',
    favicon: 'https://static.licdn.com/aero-v1/sc/h/90y3av2ns08iojcadywbxioqh',
  },
  {
    label: 'Github',
    link: 'https://github.com/UgolinOlle',
    icon: LOGOS.GithubLight,
  },
  {
    label: 'Malt',
    link: 'https://www.malt.fr/profile/ugolinolle',
    favicon: 'https://dam.malt.com/favicon.png',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/ugolin_olle',
    icon: LOGOS.XLight,
  },
  {
    label: 'NPM',
    link: 'https://www.npmjs.com/~whoa-studio',
    icon: LOGOS.NPM,
  },
];

/**
 * @constant RESOURCES
 * @description List of resources with their details
 * @type {Resources[]}
 */
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
  },
  {
    company: 'Digital Creator',
    title: 'Developer Full Stack',
    start: '2025',
    link: 'https://digitalcreator.app/',
    logo: 'https://digitalcreator.app/favicon.ico?favicon.4b4ac5f9.ico',
    id: 'digital-creator',
  },
  {
    company: 'Sugar AI',
    title: 'Developer Backend',
    start: '2025',
    link: 'https://sugarai.app/',
    logo: 'https://www.sugarai.app/favicon-16x16.png',
    id: 'sugar-ai',
  },
  {
    company: 'Le Boutiquier',
    title: 'Developer Full Stack / Support technique',
    start: '2024',
    end: '2025',
    link: 'https://leboutiquier.fr/',
    logo: 'https://res.cloudinary.com/djher1fiu/image/upload/v1758012423/xop0sw1gbaky4eiicifj.png',
    id: 'le-boutiquier',
  },
  {
    company: 'Connectra',
    title: 'Developer Front-end',
    start: '2024',
    link: '',
    logo: '/assets/logos/connectra_logo.webp',
    id: 'connectra',
  },
  {
    company: 'ComAI',
    title: 'Developer Full Stack',
    start: '2024',
    link: '',
    id: 'comai',
  },
  {
    company: 'Freelance',
    title: 'Developer Full Stack',
    start: '2021',
    end: 'Present',
    link: 'https://ugolin-olle.com',
    logo: '/favicon.ico',
    id: 'freelance',
  },
  {
    company: 'Azerty Consulting',
    title: 'Developer Full Stack',
    start: '2022',
    end: '2023',
    link: 'https://azertyconsulting.fr/',
    logo: 'https://azertyconsulting.fr/icon.png?27ebc0b5cfa491cd',
    id: 'azerty-consulting',
  },
  {
    company: 'Nicoka',
    title: 'Back-end Developer (Stage)',
    start: '2022',
    link: 'https://nicoka.com',
    logo: 'https://www.nicoka.com/assets/img/favicon.ico',
    id: 'nicoka',
  },
];

/**
 * @constant INSPIRATIONS
 * @description List of inspirations with their details
 * @type {Array<{ name: string; href: string; description: string }>}
 */
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
