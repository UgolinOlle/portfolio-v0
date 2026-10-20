import { cn } from '@portfolio-v0/shadcn/utils';

import {
  BookOpenText,
  Command,
  DiamondsFour as ComponentIcon,
  DotsThreeIcon,
  TerminalWindow as SquareTerminal,
} from '@phosphor-icons/react/ssr';
import { Bot } from 'lucide-react';

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
          <ComponentIcon className="size-7" weight="duotone" />
        </div>
      </div>
    ),
  },
  {
    name: 'Whoa Bar',
    description:
      "Composants d'interface animés conçus pour React et Next.js. (Projet en construction)",
    link: '/projects/whoa-bar',
    id: 'whoa-bar',
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
          <DotsThreeIcon className="size-7" weight="duotone" />
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
          <Command className="size-7" weight="duotone" />
        </div>
      </div>
    ),
    id: 'whoa-stash',
  },
  {
    name: 'Calyx',
    description: 'Application de nutrition IA qui analyse vos repas en photo',
    link: '/projects/calyx',
    id: 'calyx',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl border border-zinc-200 shadow',
            'bg-[radial-gradient(circle_at_50%_38%,rgb(255_255_255/0.55),transparent_55%),linear-gradient(145deg,#F6FCF8,#BFE6D1)]',
            'transition-transform duration-300 group-hover:rotate-45',
            'dark:border-zinc-700',
            'dark:bg-[radial-gradient(circle_at_50%_38%,rgb(45_184_116/0.55),transparent_55%),linear-gradient(145deg,#16382A,#07120C)]',
          )}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Calyx"
          className="relative size-full dark:hidden"
          src="/assets/projects/calyx/mark-light.svg"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Calyx"
          className="relative hidden size-full dark:block"
          src="/assets/projects/calyx/mark-dark.svg"
        />
      </div>
    ),
  },
  {
    name: 'Claude Kit',
    description:
      'CLI zéro dépendance qui configure et audite des projets Claude Code optimisés en tokens.',
    link: '/projects/claude-kit',
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
          <Bot className="size-7" />
        </div>
      </div>
    ),
    id: 'claude-kit',
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
          <SquareTerminal className="size-7" weight="duotone" />
        </div>
      </div>
    ),
    id: 'neovim-config',
  },
  {
    name: 'Whoa Jobs',
    description:
      'Collect, centralize and track job offers (work-study & full-time) from multiple job boards — in a single dashboard.',
    link: '/projects/whoa-jobs',
    id: 'whoa-jobs',
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-[#F2541B] shadow',
            'transition-transform duration-300 group-hover:rotate-45',
          )}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Whoa Jobs"
          className="relative size-full p-[13%]"
          src="/assets/projects/whoa-jobs/logo/whoa-jobs-symbol-white.png"
        />
      </div>
    ),
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
          <BookOpenText className="size-7" weight="duotone" />
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
  {
    label: 'NPM',
    link: 'https://www.npmjs.com/~ugolin-olle',
    icon: LOGOS.Npm,
    preview: {
      kind: 'npm',
      name: 'Ugolin Ollé',
      handle: '~ugolin-olle',
      avatar:
        'https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9kZDcxOWFkOWIwNTIzZGQzYTA0OTM1NzJlN2ZjNGE5Mj9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.mSd9mX2lhvKr3_0JCRsPoBiRI-ESygnrvT-IaRnQst4',
      bio: 'Building packages & projects.',
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
    name: 'Keychron K3',
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
    logo: '/assets/logos/digital-creator.png',
    id: 'digital-creator',
  },
  {
    company: 'Sugar AI',
    title: 'Developer Backend',
    start: '2025',
    link: 'https://sugarai.app/',
    logo: '/assets/logos/sugar-ai.png',
    id: 'sugar-ai',
  },
  {
    company: 'Le Boutiquier',
    title: 'Developer Full Stack / Support technique',
    start: '2024',
    end: '2025',
    link: 'https://leboutiquier.fr/',
    logo: '/assets/logos/le-boutiquier.png',
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
    logo: '/assets/logos/freelance.png',
    id: 'freelance',
  },
  {
    company: 'Azerty Consulting',
    title: 'Developer Full Stack',
    start: '2022',
    end: '2023',
    link: 'https://azertyconsulting.fr/',
    logo: '/assets/logos/azerty-consulting.png',
    id: 'azerty-consulting',
  },
  {
    company: 'Nicoka',
    title: 'Back-end Developer (Stage)',
    start: '2022',
    link: 'https://nicoka.com',
    logo: '/assets/logos/nicoka.png',
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
