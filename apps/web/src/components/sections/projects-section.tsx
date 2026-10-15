'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { PROJECTS } from '~/lib/data';
import type { Project } from '~/types';

import { SectionHeading } from './section-heading';

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { t } = useTranslation();
  const isExternal = project.link.startsWith('http');

  return (
    <Link
      className={cn(
        'group flex flex-col gap-3 rounded-2xl outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
        featured && 'sm:col-span-2',
      )}
      href={project.link}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/70 ring-inset',
          'dark:bg-zinc-900/40 dark:ring-zinc-800/70',
          featured ? 'aspect-video sm:aspect-[2.2/1]' : 'aspect-video',
        )}
      >
        {/* Decorative: the project name is the link text right below. */}
        <img
          alt=""
          className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          decoding="async"
          loading={featured ? 'eager' : 'lazy'}
          src={project.image ?? '/assets/background.svg'}
        />

        {!project.image && project.content && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center text-zinc-900 dark:text-zinc-50',
              featured && 'scale-125',
            )}
          >
            {project.content}
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h3
            className={cn(
              'font-medium text-zinc-900 dark:text-zinc-50',
              featured ? 'text-base' : 'text-sm',
            )}
          >
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-pretty text-zinc-600 dark:text-zinc-400">
            {t(`projects.descriptions.${project.id}`)}
          </p>
        </div>

        <ArrowRightIcon
          aria-hidden="true"
          className={cn(
            'mt-1 size-4 shrink-0 text-zinc-400 transition-[transform,color] duration-200',
            'group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-50',
            isExternal && '-rotate-45',
          )}
        />
      </div>
    </Link>
  );
}

export function ProjectsSection() {
  const { t } = useTranslation();
  const [featured, ...rest] = PROJECTS;

  return (
    <motion.section transition={TRANSITION_SECTION} variants={VARIANTS_SECTION} id="projects">
      <SectionHeading>{t('projects.title')}</SectionHeading>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {featured && <ProjectCard featured project={featured} />}
        {rest.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </motion.section>
  );
}
