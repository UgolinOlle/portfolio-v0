import { motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { WORKS_EXPERIENCES } from '~/lib/data';
import { cn } from '~/lib/utils';

function WorksSection() {
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 450,
    damping: 35,
  });

  const y = useSpring(mouseY, {
    stiffness: 450,
    damping: 35,
  });

  return (
    <>
      <motion.img
        src={hoveredLogo ?? ''}
        alt=""
        className="pointer-events-none fixed top-0 left-0 z-9999 h-14 w-14 rounded-xl shadow-xl"
        style={{
          x,
          y,
          opacity: hoveredLogo ? 1 : 0,
          scale: hoveredLogo ? 1 : 0.8,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.15 },
        }}
      />

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
              onMouseEnter={() => setHoveredLogo(job.logo)}
              onMouseLeave={() => setHoveredLogo(null)}
              onMouseMove={(e) => {
                mouseX.set(e.clientX + 16);
                mouseY.set(e.clientY + 16);
              }}
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
    </>
  );
}

export { WorksSection };
