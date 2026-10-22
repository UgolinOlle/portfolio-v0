import { cn } from '@portfolio-v0/shadcn/utils';

import { Command, TerminalWindow as SquareTerminal } from '@phosphor-icons/react/ssr';
import { Bot } from 'lucide-react';
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
    name: 'Whoa Stash',
    description: 'Application MacOS pour gérer le son.',
    link: '/projects/whoa-stash',
    done: false,
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
