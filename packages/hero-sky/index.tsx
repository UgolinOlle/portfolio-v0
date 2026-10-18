'use client';

import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import * as React from 'react';

import { DreamSky, type DreamSkyProps } from '@/components/ui/ugolin/dream-sky';
import { cn } from '@/lib/utils';

import { fade, rise, stack } from './motion';

type HeroSkyLink = { label: string; href: string };

type HeroSkyProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  /** Brand shown at the top left. */
  brand?: React.ReactNode;
  /** Links shown at the top right. */
  links?: HeroSkyLink[];
  /** Small pill above the headline. */
  badge?: React.ReactNode;
  /** Headline, one entry per line. Use `HeroSkyCloud` to set the cloud glyph inside a line. */
  title: React.ReactNode[];
  description?: React.ReactNode;
  /** The call to action. */
  action?: HeroSkyLink;
  /** Props forwarded to the `DreamSky` background (colours, speed, flares, clouds…). */
  sky?: Omit<DreamSkyProps, 'children' | 'className'>;
};

/** A soft cloud that sits inline with the headline, sized from the font. */
function HeroSkyCloud({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 70"
      className={cn(
        'mx-[0.12em] inline-block h-[0.78em] w-auto -translate-y-[0.04em] align-middle drop-shadow-[0_6px_14px_rgb(0_90_220/0.28)]',
        className,
      )}
      {...props}
    >
      <defs>
        <linearGradient id="hero-sky-cloud" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfe6ff" />
        </linearGradient>
      </defs>
      <path
        fill="url(#hero-sky-cloud)"
        d="M32 68C14 68 2 57 2 43c0-12 9-21 21-23C27 8 38 0 52 0c13 0 23 7 28 17 3-1 6-2 10-2 14 0 25 10 25 23 0 3-1 6-2 9 2 3 5 6 5 10 0 5-3 9-8 11-3 1-6 1-9 1H32z"
      />
    </svg>
  );
}

const glassPill =
  'rounded-full border border-white/50 bg-white/55 backdrop-blur-md shadow-[0_8px_30px_rgb(0_70_180/0.18)]';

function HeroSky({
  brand,
  links = [],
  badge,
  title,
  description,
  action,
  sky,
  className,
  ...props
}: HeroSkyProps) {
  return (
    <section
      className={cn('@container relative size-full min-h-[34rem] text-white', className)}
      {...props}
    >
      <DreamSky {...sky} className="absolute inset-0" />

      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <div className="relative flex size-full min-h-[inherit] flex-col">
            <m.header
              animate="visible"
              className="flex items-center justify-between gap-6 px-5 py-5 sm:px-10 sm:py-7"
              initial="hidden"
              variants={fade}
            >
              <div className="text-lg font-semibold tracking-tight [text-shadow:0_1px_12px_rgb(0_70_180/0.3)] @sm:text-xl">
                {brand}
              </div>
              <nav
                aria-label="Navigation"
                className="flex items-center gap-3 text-[13px] font-medium whitespace-nowrap @sm:gap-5 @sm:text-sm @2xl:gap-7"
              >
                {links.map((link) => (
                  <a
                    key={link.href + link.label}
                    className="rounded-sm text-white/90 transition-colors duration-150 ease-out [text-shadow:0_1px_10px_rgb(0_70_180/0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white can-hover:hover:text-white"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </m.header>

            <m.div
              animate="visible"
              className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 text-center sm:pb-32"
              initial="hidden"
              variants={stack}
            >
              {badge && (
                <m.p
                  className={cn(glassPill, 'px-3 py-1 text-xs font-medium tracking-wide')}
                  variants={rise}
                >
                  {badge}
                </m.p>
              )}

              <h1 className="max-w-4xl text-[clamp(1.5rem,8.4cqw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] [text-shadow:0_2px_28px_rgb(0_80_200/0.3)]">
                {title.map((line, index) => (
                  <m.span className="block whitespace-nowrap" key={index} variants={rise}>
                    {line}
                  </m.span>
                ))}
              </h1>

              {description && (
                <m.p
                  className="max-w-md text-base leading-snug text-balance text-white/90 [text-shadow:0_1px_14px_rgb(0_70_180/0.35)] sm:text-lg"
                  variants={rise}
                >
                  {description}
                </m.p>
              )}

              {action && (
                <m.div variants={rise}>
                  <a
                    className={cn(
                      glassPill,
                      'inline-flex h-12 items-center px-7 text-base font-semibold text-sky-600 transition-[transform,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] can-hover:hover:bg-white/75',
                    )}
                    href={action.href}
                  >
                    {action.label}
                  </a>
                </m.div>
              )}
            </m.div>
          </div>
        </MotionConfig>
      </LazyMotion>
    </section>
  );
}

export { HeroSky, HeroSkyCloud };
export type { HeroSkyLink, HeroSkyProps };
