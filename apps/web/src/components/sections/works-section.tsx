import { motion } from 'motion/react';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { WORKS_EXPERIENCES } from '~/lib/data';
import { cn } from '~/lib/utils';

function WorksSection() {
  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} id="works">
      <h3 className="mb-3 text-lg font-medium">Works Experiences</h3>
      <div className="flex flex-col space-y-2">
        {WORKS_EXPERIENCES.map((job) => (
          <div
            className={cn(
              'relative -mx-3 flex w-full flex-col justify-between gap-2',
              'overflow-hidden rounded-xl px-3 py-3 text-sm lg:flex-row lg:gap-0 ',
            )}
            key={job.id}
          >
            <div className="flex flex-col justify-start lg:flex-row lg:items-center lg:gap-2">
              <h4 className="font-normal dark:text-zinc-100">{job.company}</h4>
              <p className="text-zinc-500 dark:text-zinc-400">{job.title}</p>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              {job.start} {job.end && `- ${job.end}`}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export { WorksSection };
