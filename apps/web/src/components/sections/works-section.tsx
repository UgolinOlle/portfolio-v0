'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { WORKS_EXPERIENCES } from '~/lib/data';

import { useTranslation } from '../core/i18n-provider';

function WorksSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'en' ? 'en' : 'fr';
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} id="works">
      <div className="mb-5 flex items-center justify-center gap-4">
        <h3 className="w-auto text-lg font-medium whitespace-nowrap">{t('sections.works')}</h3>
        <span className="h-px w-full bg-zinc-400" />
      </div>

      <motion.div className="flex flex-col space-y-2" layout>
        {WORKS_EXPERIENCES.map((job) => (
          <motion.div
            layout="position"
            key={job.id}
            onFocus={() => setActiveId(job.id)}
            onHoverStart={() => setActiveId(job.id)}
            onHoverEnd={() => setActiveId(null)}
            onBlur={() => setActiveId(null)}
            tabIndex={0}
            className={cn(
              'relative -mx-3 flex w-full justify-between gap-2',
              'flex-row items-start rounded-xl px-3 py-3 text-sm outline-none lg:gap-0',
              'focus-visible:ring-2 focus-visible:ring-primary/40',
            )}
            transition={{
              layout: {
                type: 'spring',
                stiffness: 420,
                damping: 38,
                mass: 0.8,
              },
            }}
          >
            <div className="flex min-w-0 flex-row items-start justify-start lg:gap-2">
              <div className="mr-1 h-8 w-8" style={{ perspective: 1000 }}>
                <motion.div
                  className="relative h-full w-full"
                  animate={{
                    rotateY: job.logo && activeId === job.id ? 180 : 0,
                    scale: job.logo && activeId === job.id ? 1.05 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 22,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Face avant */}
                  <div
                    className={cn(
                      'absolute inset-0 flex items-center justify-center rounded-lg border',
                      'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
                    )}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-xs font-semibold">
                      {job.company.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Face arrière uniquement si logo */}
                  {job.logo && (
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center rounded-lg border bg-white',
                        'dark:bg-zinc-900',
                      )}
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="size-5 rounded object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex flex-col px-2">
                <h4 className="font-normal dark:text-zinc-100">{job.company}</h4>
                <p className="text-zinc-500 dark:text-zinc-400">{job.title}</p>
                <AnimatePresence initial={false}>
                  {activeId === job.id && (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1, scaleY: 1, y: 0 }}
                      className={cn(
                        'relative mt-3 origin-top pl-4 text-xs',
                        'before:absolute before:top-0 before:bottom-3 before:left-0 before:border-l',
                        'before:border-zinc-300 dark:before:border-zinc-700',
                      )}
                      exit={{ height: 0, opacity: 0, scaleY: 0.96, y: -4 }}
                      initial={{ height: 0, opacity: 0, scaleY: 0.96, y: -6 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p
                        className={cn(
                          'relative text-zinc-600 before:absolute before:top-1/2 before:left-[-1.05rem] before:w-3 before:border-t',
                          "before:border-zinc-300 before:content-[''] dark:text-zinc-400 dark:before:border-zinc-700",
                        )}
                      >
                        {job.details[language].length}{' '}
                        {job.details[language].length === 1
                          ? t('sections.achievement')
                          : t('sections.achievements')}
                      </p>
                      <ul className="mt-1 space-y-1 text-zinc-500 dark:text-zinc-400">
                        {job.details[language].map((detail) => (
                          <li
                            className={cn(
                              'relative pl-4 before:absolute before:top-1/2 before:-left-4 before:w-3',
                              "before:border-t before:border-zinc-300 before:content-['']",
                              'dark:before:border-zinc-700',
                            )}
                            key={detail}
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400">
              {job.start} {job.end && `- ${job.end}`}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export { WorksSection };
