'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, m } from 'motion/react';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { ArrowRightIcon } from '~/components/icons/ui';
import { WORKS_EXPERIENCES } from '~/data/works';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import type { WorkExperience } from '~/types';

import { useTranslation } from '../core/i18n-provider';

import { HomeHeading } from './home-heading';

/** Press-and-hold duration before a finger scrubs the list instead of scrolling the page. */
const HOLD_MS = 250;
/** Finger travel that cancels the hold: the user wants to scroll. */
const HOLD_TOLERANCE = 10;

const LABELS = {
  fr: { current: 'En poste', visit: 'Voir le site' },
  en: { current: 'Current', visit: 'Visit site' },
} as const;

type Selection = { index: number; direction: 1 | -1 };

/** Content enters from the side the selection moved toward and leaves the opposite way (`custom` = direction). */
const DETAIL_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, y: 6 * direction }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    y: -6 * direction,
    transition: { duration: 0.12 },
  }),
};

const periodOf = (job: WorkExperience) =>
  job.end && job.end !== 'Present' ? `${job.start} – ${job.end}` : job.start;

type CompanyLogoProps = {
  company: string;
  logo?: string;
};

/** Company logo, with the initial as a fallback when there is none or the remote favicon fails. */
function CompanyLogo({ company, logo }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // An image that already failed before hydration never fires onError: catch it on mount.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  const showLogo = logo !== undefined && logo !== '' && !failed;

  return (
    <div
      className={cn(
        'flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-zinc-200/70 ring-inset',
        'dark:ring-zinc-800/70',
        showLogo
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
      )}
    >
      {showLogo && logo ? (
        // Decorative: the company name is written right next to it.
        <Image
          alt=""
          className="size-7 rounded object-contain"
          height={28}
          loading="lazy"
          onError={() => setFailed(true)}
          ref={imageRef}
          src={logo}
          width={28}
        />
      ) : (
        <span aria-hidden="true" className="text-base font-semibold">
          {company.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

type DetailProps = {
  job: WorkExperience;
  lang: 'fr' | 'en';
};

function WorkDetail({ job, lang }: DetailProps) {
  const labels = LABELS[lang];

  return (
    <div className="flex flex-col items-start gap-4">
      <CompanyLogo company={job.company} logo={job.logo} />

      <div className="flex flex-col gap-1">
        <p className="text-lg leading-snug font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {job.title}
        </p>
        <p className="text-base text-pretty text-zinc-600 dark:text-zinc-400">
          {job.description[lang]}
        </p>
      </div>

      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2',
          'text-[11px] leading-none font-medium text-zinc-600 tabular-nums',
          'ring-1 ring-zinc-200/70 ring-inset dark:text-zinc-300 dark:ring-zinc-700/70',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', job.current ? 'bg-emerald-500' : 'bg-zinc-400')}
        />
        {job.current ? `${job.start} – ${labels.current}` : periodOf(job)}
      </span>

      {job.link !== '' && (
        <a
          className={cn(
            'group/visit inline-flex items-center gap-1.5 rounded-md text-sm font-medium outline-none',
            'text-zinc-900 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 dark:text-zinc-50',
          )}
          href={job.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {labels.visit}
          <ArrowRightIcon
            aria-hidden="true"
            className="size-4 -rotate-45 text-zinc-400 transition-[transform,color] duration-200 group-hover/visit:translate-x-0.5 group-hover/visit:text-zinc-900 dark:group-hover/visit:text-zinc-50"
          />
        </a>
      )}
    </div>
  );
}

function WorksSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';

  const [selection, setSelection] = useState<Selection>({ index: 0, direction: 1 });
  const [engaged, setEngaged] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hold = useRef({ timer: 0, active: false, startX: 0, startY: 0 });

  const select = useCallback((index: number) => {
    setSelection((current) => {
      if (current.index === index) return current;
      // A short tick per step while a finger scrubs (where the browser supports it).
      if (hold.current.active) navigator.vibrate?.(6);
      return { index, direction: index > current.index ? 1 : -1 };
    });
  }, []);

  const pickAt = (x: number, y: number) => {
    const row = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-row]');
    if (row) select(Number(row.dataset.row));
  };

  // Once the hold is recognised, stop the page from scrolling under the finger.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onTouchMove = (event: TouchEvent) => {
      if (hold.current.active && event.cancelable) event.preventDefault();
    };
    list.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => list.removeEventListener('touchmove', onTouchMove);
  }, []);

  useEffect(() => () => window.clearTimeout(hold.current.timer), []);

  const endHold = () => {
    window.clearTimeout(hold.current.timer);
    if (hold.current.active) {
      hold.current.active = false;
      setEngaged(false);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'touch') return;
    const { clientX, clientY } = event;
    hold.current.startX = clientX;
    hold.current.startY = clientY;
    window.clearTimeout(hold.current.timer);
    hold.current.timer = window.setTimeout(() => {
      hold.current.active = true;
      setEngaged(true);
      navigator.vibrate?.(10);
      pickAt(hold.current.startX, hold.current.startY);
    }, HOLD_MS);
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'touch') return;
    if (hold.current.active) {
      pickAt(event.clientX, event.clientY);
      return;
    }
    const moved = Math.hypot(
      event.clientX - hold.current.startX,
      event.clientY - hold.current.startY,
    );
    if (moved > HOLD_TOLERANCE) window.clearTimeout(hold.current.timer);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = WORKS_EXPERIENCES.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: Math.min(selection.index + 1, last),
      ArrowUp: Math.max(selection.index - 1, 0),
      Home: 0,
      End: last,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    rowRefs.current[next]?.focus();
  };

  const selected = WORKS_EXPERIENCES[selection.index];

  return (
    <m.section {...SECTION_REVEAL_LIST} id="works">
      <HomeHeading>{t('sections.works')}</HomeHeading>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <ul
          className="flex touch-pan-y flex-col select-none [-webkit-touch-callout:none]"
          onBlur={() => setEngaged(false)}
          onContextMenu={(event) => {
            if (hold.current.active) event.preventDefault();
          }}
          onFocus={() => setEngaged(true)}
          onKeyDown={onKeyDown}
          onPointerCancel={endHold}
          onPointerDown={onPointerDown}
          onPointerEnter={(event) => event.pointerType !== 'touch' && setEngaged(true)}
          onPointerLeave={(event) => {
            if (event.pointerType !== 'touch') setEngaged(false);
          }}
          onPointerMove={onPointerMove}
          onPointerUp={endHold}
          ref={listRef}
        >
          {WORKS_EXPERIENCES.map((job, index) => {
            const isSelected = index === selection.index;

            return (
              <m.li transition={TRANSITION_SECTION} variants={VARIANTS_SECTION} key={job.id}>
                <button
                  aria-current={isSelected}
                  className={cn(
                    'relative flex w-full items-baseline justify-between gap-4 rounded-2xl py-2.5 text-left outline-none',
                    'transition-opacity duration-200 ease-out',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    engaged && !isSelected && 'opacity-45 motion-reduce:opacity-100',
                  )}
                  data-row={index}
                  onClick={() => select(index)}
                  onFocus={() => select(index)}
                  onPointerEnter={(event) => event.pointerType !== 'touch' && select(index)}
                  ref={(node) => {
                    rowRefs.current[index] = node;
                  }}
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                >
                  {isSelected && (
                    <m.span
                      aria-hidden="true"
                      className="absolute -inset-x-3 inset-y-0 rounded-2xl bg-zinc-900/[0.05] dark:bg-zinc-50/[0.07]"
                      layoutId="works-focus"
                      transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    />
                  )}

                  <span className="relative text-[1.625rem] leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[1.875rem] dark:text-zinc-50">
                    {job.company}
                  </span>
                  <span className="relative flex shrink-0 items-center gap-1.5 text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
                    {periodOf(job)}
                    {job.current && (
                      <>
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="sr-only">{LABELS[lang].current}</span>
                      </>
                    )}
                  </span>
                </button>
              </m.li>
            );
          })}
        </ul>

        <div className="relative order-first min-h-44 md:sticky md:top-24 md:order-last md:min-h-0 md:self-start md:border-l md:border-zinc-200/70 md:pl-8 dark:md:border-zinc-800/70">
          <AnimatePresence custom={selection.direction} initial={false} mode="popLayout">
            {selected && (
              <m.div
                animate="center"
                custom={selection.direction}
                exit="exit"
                initial="enter"
                key={selected.id}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                variants={DETAIL_VARIANTS}
              >
                <WorkDetail job={selected} lang={lang} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </m.section>
  );
}

export { WorksSection };
