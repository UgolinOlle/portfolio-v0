'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import { useState } from 'react';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { WORKS_EXPERIENCES } from '~/lib/data';

import { useTranslation } from '../core/i18n-provider';

function WorksSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'en' ? 'en' : 'fr';

  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} id="works">
      <div className="mb-5 flex items-center justify-center gap-4">
        <h3 className="w-auto text-lg font-medium whitespace-nowrap">{t('sections.works')}</h3>
        <span className="h-px w-full bg-zinc-400" />
      </div>

      <div className="flex flex-col space-y-2">
        {WORKS_EXPERIENCES.map((job) => (
          <motion.div
            key={job.id}
            onHoverStart={() => job.logo && setHoveredId(job.id)}
            onHoverEnd={() => setHoveredId(null)}
            className={cn(
              'relative -mx-3 flex w-full justify-between gap-2',
              'flex-row overflow-hidden rounded-xl px-3 py-3 text-sm lg:gap-0',
            )}
          >
            <div className="flex flex-row justify-start lg:items-center lg:gap-2">
              <div className="mr-1 h-8 w-8" style={{ perspective: 1000 }}>
                <motion.div
                  className="relative h-full w-full"
                  animate={{
                    rotateY: job.logo && hoveredId === job.id ? 180 : 0,
                    scale: job.logo && hoveredId === job.id ? 1.05 : 1,
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
                <div className="mt-3 border-l border-zinc-300 pl-4 text-xs dark:border-zinc-700">
                  <p className="relative text-zinc-600 before:absolute before:-left-[1.05rem] before:top-1/2 before:w-3 before:border-t before:border-zinc-300 before:content-[''] dark:text-zinc-400 dark:before:border-zinc-700">
                    {job.details[language].length}{' '}
                    {job.details[language].length === 1
                      ? t('sections.achievement')
                      : t('sections.achievements')}
                  </p>
                  <ul className="mt-1 space-y-1 text-zinc-500 dark:text-zinc-400">
                    {job.details[language].map((detail) => (
                      <li
                        className="relative pl-4 before:absolute before:-left-4 before:top-0 before:h-full before:border-l before:border-zinc-300 after:absolute after:-left-4 after:top-1/2 after:w-3 after:border-t after:border-zinc-300 after:content-[''] last:before:h-1/2 dark:before:border-zinc-700 dark:after:border-zinc-700"
                        key={detail}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400">
              {job.start} {job.end && `- ${job.end}`}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export { WorksSection };
