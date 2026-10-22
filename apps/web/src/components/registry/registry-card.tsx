'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Link from 'next/link';
import { type PointerEvent, type ReactNode, useRef } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowUpRightIcon } from '~/components/icons/ui';
import { EASE_OUT } from '~/lib/constants';
import type { RegistryItem } from '~/lib/registry';

type RegistryCardProps = {
  item: RegistryItem;
  // Position in its grid: staggers the entrance (capped, so late cards never wait).
  index?: number;
  preview?: ReactNode;
  // `wide`: landscape frame and a full description, for whole-page templates.
  variant?: 'default' | 'wide';
};

// A cell of the hairline grid (see RegistryGrid): square, borderless on top/left, with the
// title link stretched over the whole cell so it's a single tab stop.
export const RegistryCard = ({
  item,
  index = 0,
  preview,
  variant = 'default',
}: RegistryCardProps) => {
  const isWide = variant === 'wide';
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);

  // Cursor spotlight: decorative, springed so it trails the pointer. Mouse only.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spotX = useSpring(pointerX, { stiffness: 120, damping: 20 });
  const spotY = useSpring(pointerY, { stiffness: 120, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${spotX}px ${spotY}px, color-mix(in oklch, var(--color-foreground) 7%, transparent), transparent 90%)`;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  // Featured thumbnail drifts a few pixels against the scroll.
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], [6, -6]);

  return (
    <m.article
      onPointerMove={onPointerMove}
      ref={cardRef}
      className={cn(
        'group relative flex flex-col border-e border-b border-foreground/5 transition-colors',
        '[content-visibility:auto]',
        !isWide && item.featured && 'sm:col-span-2',
        'hover:bg-foreground/2 has-[a:focus-visible]:outline-2',
        'has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring',
      )}
      initial={{ opacity: 0, transform: 'translateY(12px)' }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.45, ease: EASE_OUT }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          isWide ? 'aspect-16/10' : cn('aspect-4/3', item.featured && 'sm:aspect-8/3'),
          'bg-[radial-gradient(color-mix(in_oklch,var(--color-foreground)_10%,transparent)_1px,transparent_1px)]',
          'bg-size-[16px_16px]',
        )}
      >
        {preview ? (
          <m.div className="size-full" style={item.featured && !reduce ? { y: drift } : undefined}>
            <div
              className={cn(
                'size-full transition-transform duration-250 ease-out-strong',
                'group-hover:scale-[1.03] group-active:scale-[0.985]',
              )}
            >
              {preview}
            </div>
          </m.div>
        ) : (
          <div className="label-mono flex size-full items-center justify-center text-foreground/40">
            {t('registry.card.previewComingSoon')}
          </div>
        )}
      </div>

      {!reduce && (
        <m.div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300',
            'not-[@media(hover:hover)]:hidden group-hover:opacity-100',
          )}
          style={{ background: spotlight }}
        />
      )}

      <div className="flex items-center gap-3 border-t border-foreground/5 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-sm font-medium">
            <Link
              className="after:absolute after:inset-0 focus-visible:outline-none"
              href={item.href}
            >
              {item.title}
            </Link>
          </h3>

          {item.description && (
            <p
              className={cn(
                'text-xs text-foreground/50',
                isWide ? 'line-clamp-2 text-pretty' : 'line-clamp-1',
              )}
            >
              {item.description}
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          className={cn(
            'flex size-7 shrink-0 items-center justify-center overflow-hidden border border-foreground/10 text-foreground/50 transition-colors',
            'group-hover:border-foreground group-hover:bg-foreground group-hover:text-background',
          )}
        >
          <ArrowUpRightIcon
            className={cn(
              'size-3.5 transition-transform duration-200 ease-out-strong',
              'group-hover:translate-x-px group-hover:-translate-y-px',
            )}
          />
        </span>
      </div>
    </m.article>
  );
};
