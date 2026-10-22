'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import { PROJECTS } from '~/data/projects';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import type { Project } from '~/types';

import { SectionHeading } from './section-heading';

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  index?: number;
};

function ProjectCard({ project, featured = false, index = 0 }: ProjectCardProps) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const isExternal = project.link.startsWith('http');

  return (
    <m.div
      className={cn(featured && 'sm:col-span-2')}
      transition={{ ...TRANSITION_SECTION, delay: (index % 2) * 0.06 }}
      variants={VARIANTS_SECTION}
    >
      <Link
        className={cn(
          'group flex flex-col gap-3 rounded-2xl outline-none',
          `transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]`,
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
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
            className={cn(
              'absolute inset-0 size-full object-cover transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]',
              // The featured image is the LCP candidate: never hide it before hydration.
              !featured && !loaded && 'opacity-0',
            )}
            decoding="async"
            loading={featured ? 'eager' : 'lazy'}
            onError={() => setLoaded(true)}
            onLoad={() => setLoaded(true)}
            // An image already cached before hydration never fires onLoad.
            ref={(image) => {
              if (image?.complete) {
                setLoaded(true);
              }
            }}
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

          {project.done === false && (
            <span
              className={cn(
                'absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2',
                'bg-white/80 text-[11px] leading-none font-medium text-zinc-600 backdrop-blur-sm',
                'ring-1 ring-zinc-200/70 ring-inset',
                'dark:bg-zinc-950/60 dark:text-zinc-300 dark:ring-zinc-700/70',
              )}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
              {t('projects.wip')}
            </span>
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
    </m.div>
  );
}

export function ProjectsSection() {
  const { t } = useTranslation();
  const [featured, ...rest] = PROJECTS;

  return (
    <m.section {...SECTION_REVEAL_LIST} id="projects">
      <SectionHeading>{t('projects.title')}</SectionHeading>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {featured && <ProjectCard featured project={featured} />}
        {rest.map((project, index) => (
          <ProjectCard index={index + 1} key={project.id} project={project} />
        ))}
      </div>
    </m.section>
  );
}
