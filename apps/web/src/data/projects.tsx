import { cn } from '@portfolio-v0/shadcn/utils';

import Image from 'next/image';

import type { Project } from '~/types';

export const PROJECTS: Project[] = [
  {
    name: 'Whoa UI Components',
    description: "Composants d'interface animés conçus pour React et Next.js.",
    link: '/ui',
    id: 'whoa-ui',
    content: (
      <div className="relative size-12">
        <Image
          fill
          sizes="48px"
          alt="Whoa UI"
          className={cn(
            'absolute inset-0 size-full rounded-xl shadow',
            'transition-transform duration-300 group-hover:rotate-45',
          )}
          unoptimized
          src="/favicon.ico"
        />
      </div>
    ),
  },
  {
    name: 'Whoa Type',
    description:
      'A macOS utility that adds sound to typing and clicks, with 38 built-in sound packs, previews, and a native audio engine.',
    link: '/projects/whoa-type',
    id: 'whoa-type',
    done: true,
    content: (
      <div className="relative size-12">
        <Image
          fill
          sizes="48px"
          alt="Whoa Type"
          className={cn(
            'absolute inset-0 size-full scale-150 drop-shadow-md',
            'transition-transform duration-150 ease-out-strong',
            'group-hover:translate-y-1 group-hover:scale-[1.38]',
            'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-150',
          )}
          unoptimized
          src="/assets/projects/whoa-type/whoa-type-logo.png"
        />
      </div>
    ),
  },
  {
    name: 'Whoa Stash',
    description: 'Application MacOS pour gérer le son.',
    link: '/projects/whoa-stash',
    done: false,
    content: (
      <div className="relative size-12">
        <Image
          fill
          sizes="48px"
          alt="Whoa Stash"
          className={cn(
            'absolute inset-0 size-full rounded-xl shadow',
            'transition-transform duration-300 group-hover:rotate-45',
          )}
          unoptimized
          src="/assets/projects/whoa-stash/icon-master.svg"
        />
      </div>
    ),
    id: 'whoa-stash',
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

        <Image
          fill
          sizes="48px"
          alt="Claude Code"
          className="relative size-full p-[18%]"
          unoptimized
          src="/assets/projects/claude-kit/claude-code-logo.svg"
        />
      </div>
    ),
    id: 'claude-kit',
  },
  {
    name: 'Whoa Jobs',
    description:
      'Collect, centralize and track job offers (work-study & full-time) from multiple job boards — in a single dashboard.',
    link: '/projects/whoa-jobs',
    id: 'whoa-jobs',
    done: false,
    content: (
      <div className="relative size-12">
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-[#F2541B] shadow',
            'transition-transform duration-300 group-hover:rotate-45',
          )}
        />

        <Image
          fill
          sizes="48px"
          alt="Whoa Jobs"
          className="relative size-full p-[13%]"
          src="/assets/projects/whoa-jobs/logo/whoa-jobs-symbol-white.png"
        />
      </div>
    ),
  },
  {
    name: 'Calyx',
    description: 'Application de nutrition IA qui analyse vos repas en photo',
    link: '/projects/calyx',
    id: 'calyx',
    done: false,
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

        <Image
          fill
          sizes="48px"
          alt="Calyx"
          className="relative size-full dark:hidden"
          unoptimized
          src="/assets/projects/calyx/mark-light.svg"
        />
        <Image
          fill
          sizes="48px"
          alt="Calyx"
          className="relative hidden size-full dark:block"
          unoptimized
          src="/assets/projects/calyx/mark-dark.svg"
        />
      </div>
    ),
  },
  {
    name: 'Whoa Bar',
    description: 'Application macOS pour gérer la barre de menu.',
    link: '/projects/whoa-bar',
    id: 'whoa-bar',
    done: false,
    content: (
      <div className="relative size-12">
        <Image
          fill
          sizes="48px"
          alt="Whoa Bar"
          className={cn(
            'absolute inset-0 size-full scale-[1.24]',
            'transition-transform duration-300 group-hover:rotate-45',
          )}
          unoptimized
          src="/assets/projects/whoa-bar/whoa-bar-logo.svg"
        />
      </div>
    ),
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

        <Image
          fill
          sizes="48px"
          alt="Neovim"
          className="relative size-full p-[22%]"
          unoptimized
          src="/assets/projects/neovim-config/neovim-logo.svg"
        />
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

        <Image
          fill
          sizes="48px"
          alt="42"
          className="relative size-full p-[22%] dark:invert"
          unoptimized
          src="/assets/logos/42.svg"
        />
      </div>
    ),
    id: '42',
  },
];
