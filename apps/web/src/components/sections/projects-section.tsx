'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import Link from 'next/link';

import { useTranslation } from '~/components/i18n/i18n-provider';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { PROJECTS } from '~/lib/data';

export function ProjectsSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      className="space-y-6"
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      id="projects"
    >
      <h3 className="text-lg">{t('projects.title')}</h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <div className="group aspect-video space-y-2" key={index}>
            <Link
              key={project.link}
              rel="noopener noreferrer"
              href={project.link}
              target={project.link.startsWith('http') ? '_blank' : undefined}
            >
              <div
                className={cn(
                  'group relative aspect-video rounded-2xl bg-zinc-50/40 ring-1',
                  'ring-zinc-200/50 transition-all duration-300 ring-inset',
                  'dark:bg-zinc-950/40 dark:ring-zinc-800/50',
                )}
              >
                <div className="absolute inset-0 aspect-video overflow-hidden rounded-2xl text-zinc-900 dark:text-zinc-50">
                  <img
                    alt={`${project.name} background`}
                    className="aspect-video object-cover transition duration-500 group-hover:scale-105"
                    src="/assets/background.svg"
                  />

                  {project.content && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-zinc-900 dark:text-zinc-50">{project.content}</div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-1 py-2">
              <Link
                className="group font-base relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                rel="noopener noreferrer"
                target={project.link.startsWith('http') ? '_blank' : undefined}
                href={project.link}
              >
                {project.name}

                <span
                  className={cn(
                    'absolute bottom-0.5 left-0 block h-px w-full bg-foreground',
                    'max-w-0 transition-all duration-200 group-hover:max-w-full',
                  )}
                />
              </Link>

              <p className="mt-2 font-sans text-sm text-zinc-600 dark:text-zinc-300">
                {t(`projects.descriptions.${project.id}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
