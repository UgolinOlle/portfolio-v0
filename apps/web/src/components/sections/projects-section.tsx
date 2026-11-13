'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { PROJECTS } from '~/data/projects';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import type { Project } from '~/types';

import { HomeHeading } from './home-heading';
import { ProjectTile } from './project-tile';

type Slot = { x: number; y: number; rotate: number; delay: number };

// Card centres relative to the icon centre. The middle card leads, the sides follow.
const SLOTS: Record<1 | 2 | 3, Slot[]> = {
  1: [{ x: 0, y: -92, rotate: 0, delay: 0 }],
  2: [
    { x: -44, y: -88, rotate: -8, delay: 0 },
    { x: 44, y: -88, rotate: 8, delay: 0.03 },
  ],
  3: [
    { x: -76, y: -80, rotate: -12, delay: 0.03 },
    { x: 0, y: -96, rotate: 0, delay: 0 },
    { x: 76, y: -80, rotate: 12, delay: 0.03 },
  ],
};

const FAN_HALF_WIDTH = 160; // widest card edge from the icon centre, rotation included
const FAN_HEIGHT = 150; // room the fan needs above the icon centre
const EDGE = 16;

const OPEN = { type: 'spring', bounce: 0, duration: 0.3 } as const;
const CLOSE = { type: 'spring', bounce: 0, duration: 0.2 } as const;

type Fan = { id: string; shift: number; dir: 1 | -1 };

/** Keeps the fan inside the viewport: slides it sideways near an edge, flips it below when the top is tight. */
function measureFan(id: string, el: HTMLElement): Fan {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const left = EDGE - (cx - FAN_HALF_WIDTH);
  const right = cx + FAN_HALF_WIDTH - (window.innerWidth - EDGE);
  const shift = left > 0 ? left : right > 0 ? -right : 0;
  const dir = rect.top + rect.height / 2 < FAN_HEIGHT ? -1 : 1;

  return { id, shift, dir };
}

function FanCards({ fan, images, open }: { fan: Fan | null; images: string[]; open: boolean }) {
  const slots = SLOTS[images.length as 1 | 2 | 3];
  if (!slots) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-10 left-1/2 size-0">
      {images.map((src, i) => {
        const slot = slots[i];
        if (!slot) return null;
        const dir = fan?.dir ?? 1;

        return (
          <m.div
            animate={
              open
                ? {
                    opacity: 1,
                    scale: 1,
                    x: slot.x + (fan?.shift ?? 0),
                    y: slot.y * dir,
                    rotate: slot.rotate * dir,
                  }
                : { opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }
            }
            className={cn(
              'absolute -top-[45px] -left-[72px] h-[90px] w-[144px] overflow-hidden rounded-xl',
              'bg-zinc-100 shadow-lg ring-1 ring-black/10 ring-inset dark:bg-zinc-900 dark:ring-white/10',
            )}
            initial={false}
            key={src}
            style={{ originY: 1, zIndex: i === 1 || slots.length < 3 ? 3 : 2 }}
            transition={open ? { ...OPEN, delay: slot.delay } : CLOSE}
          >
            <Image alt="" className="object-cover" fill sizes="144px" src={src} />
          </m.div>
        );
      })}
    </div>
  );
}

type ProjectIconProps = {
  project: Project;
  slug: string;
  images: string[];
  fan: Fan | null;
  lastInput: RefObject<'mouse' | 'touch' | 'key'>;
  onActivate: (id: string, el: HTMLElement) => void;
  onClear: () => void;
};

function ProjectIcon({
  project,
  slug,
  images,
  fan,
  lastInput,
  onActivate,
  onClear,
}: ProjectIconProps) {
  const isExternal = project.link.startsWith('http');
  const open = fan?.id === project.id;
  const dimmed = fan !== null && !open;
  const preview = images.slice(0, 3);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Touch: the first tap previews, the second opens.
    if (lastInput.current === 'touch' && preview.length > 0 && !open) {
      event.preventDefault();
      onActivate(project.id, event.currentTarget);
    }
  };

  return (
    <m.li
      className={cn('relative', open && 'z-20')}
      data-slug={slug}
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
    >
      <Link
        className={cn(
          'flex flex-col items-center gap-2 rounded-2xl p-1 outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
          'transition-[filter,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
          dimmed && 'opacity-50 grayscale',
        )}
        href={project.link}
        onBlur={onClear}
        onClick={onClick}
        onFocus={(event) => {
          if (lastInput.current !== 'touch') onActivate(project.id, event.currentTarget);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') onActivate(project.id, event.currentTarget);
        }}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        target={isExternal ? '_blank' : undefined}
      >
        <span className="relative">
          <span
            className={cn(
              'relative z-10 block transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
              'active:scale-95 motion-reduce:transition-none',
            )}
          >
            <ProjectTile fallback={project.content} id={project.id} />
          </span>
          {project.done === false && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 z-20 size-3 rounded-full bg-amber-500 ring-2 ring-background"
            />
          )}
          <FanCards fan={fan} images={preview} open={open} />
        </span>
        <span className="max-w-full truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {project.name}
        </span>
      </Link>
    </m.li>
  );
}

export function ProjectsSection({ previews = {} }: { previews?: Record<string, string[]> }) {
  const { t } = useTranslation();
  const [fan, setFan] = useState<Fan | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const lastInput = useRef<'mouse' | 'touch' | 'key'>('mouse');

  const onActivate = useCallback((id: string, el: HTMLElement) => setFan(measureFan(id, el)), []);
  const onClear = useCallback(() => setFan(null), []);

  // Escape closes the fan; a touch outside the grid dismisses a previewed icon.
  useEffect(() => {
    if (!fan) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setFan(null);
    const onDown = (event: PointerEvent) => {
      if (!gridRef.current?.contains(event.target as Node)) setFan(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [fan]);

  const active = PROJECTS.find((project) => project.id === fan?.id);

  return (
    <m.section {...SECTION_REVEAL_LIST} id="projects">
      <HomeHeading>{t('projects.title')}</HomeHeading>

      <ul
        className="grid grid-cols-3 gap-x-2 gap-y-8 sm:grid-cols-4"
        onKeyDownCapture={() => {
          lastInput.current = 'key';
        }}
        onPointerDownCapture={(event) => {
          lastInput.current = event.pointerType === 'touch' ? 'touch' : 'mouse';
        }}
        onPointerLeave={(event) => {
          // Per grid, not per icon: the gaps between icons must not flash colour back.
          if (event.pointerType !== 'touch') setFan(null);
        }}
        ref={gridRef}
      >
        {PROJECTS.map((project) => {
          const slug = project.link.split('/').pop() ?? project.id;

          return (
            <ProjectIcon
              fan={fan}
              images={previews[slug] ?? []}
              key={project.id}
              lastInput={lastInput}
              onActivate={onActivate}
              onClear={onClear}
              project={project}
              slug={slug}
            />
          );
        })}
      </ul>

      {/* Fixed height: the description changing must never move the page. */}
      <p
        aria-live="polite"
        className="mt-6 min-h-12 text-base text-pretty text-zinc-600 dark:text-zinc-400"
      >
        {active && (
          <>
            {t(`projects.descriptions.${active.id}`)}
            {active.done === false && (
              <span className="ml-2 inline-flex items-center gap-1.5 text-sm whitespace-nowrap text-zinc-500">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
                {t('projects.wip')}
              </span>
            )}
          </>
        )}
      </p>
    </m.section>
  );
}
