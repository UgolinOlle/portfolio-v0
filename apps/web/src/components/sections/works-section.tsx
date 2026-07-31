import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import { useState } from 'react';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { WORKS_EXPERIENCES } from '~/lib/data';

function WorksSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} id="works">
      <h3 className="mb-3 text-lg font-medium">Works Experiences</h3>

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
                    <job.icon className="size-4" strokeWidth={2.25} />
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
