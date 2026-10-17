'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

export type Screenshot = {
  /** Image shown in light mode. */
  light: string;
  /** Image shown in dark mode. */
  dark: string;
  alt: string;
  caption?: string;
};

type ScreenshotsProps = {
  items: Screenshot[];
};

// Expo-out: fast start, long soft landing. Reads as "settling into place".
const EASE = [0.22, 1, 0.36, 1] as const;

/** Light/dark screenshot grid with a staggered reveal, hover lift and a keyboard-closable lightbox. */
export function Screenshots({ items }: ScreenshotsProps) {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  // The first item is the showcase: it spans the full row alone or when it leads a grid of 3+.
  // Two items stay side by side.
  const featuredFirst = items.length !== 2;
  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item, index) => (
          <motion.li
            key={item.light}
            className={cn(featuredFirst && index === 0 && 'sm:col-span-2')}
            initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.9,
              ease: EASE,
              delay: reduceMotion ? 0 : (index % 2) * 0.1,
            }}
          >
            <motion.button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`${item.alt}, agrandir`}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 text-left shadow-sm transition-shadow duration-500 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:ring-zinc-50"
            >
              <ScreenshotImage
                item={item}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </motion.button>

            {item.caption && (
              <p className="mt-3 px-1 font-mono text-xs tracking-wide text-zinc-500 dark:text-zinc-400">
                {item.caption}
              </p>
            )}
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          // Keyed so AnimatePresence keeps the last image mounted while the exit animation plays.
          <Lightbox key={openIndex} item={active} onClose={close} reduceMotion={reduceMotion} />
        )}
      </AnimatePresence>
    </>
  );
}

type ScreenshotImageProps = {
  item: Screenshot;
  className?: string;
  loading?: 'lazy' | 'eager';
};

function ScreenshotImage({ item, className, loading }: ScreenshotImageProps) {
  return (
    <>
      <img
        src={item.light}
        alt={item.alt}
        loading={loading}
        decoding="async"
        className={cn('block h-auto w-full dark:hidden', className)}
      />
      <img
        src={item.dark}
        alt={item.alt}
        loading={loading}
        decoding="async"
        aria-hidden="true"
        className={cn('hidden h-auto w-full dark:block', className)}
      />
    </>
  );
}

type LightboxProps = {
  item: Screenshot;
  onClose: () => void;
  reduceMotion: boolean | null;
};

function Lightbox({ item, onClose, reduceMotion }: LightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      data-lenis-prevent
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm sm:p-10"
    >
      <motion.figure
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={(event) => event.stopPropagation()}
        className="m-0 max-h-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <ScreenshotImage item={item} className="max-h-[85vh] w-auto max-w-full" />
      </motion.figure>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-zinc-100 backdrop-blur transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        Esc
      </button>
    </motion.div>
  );
}
