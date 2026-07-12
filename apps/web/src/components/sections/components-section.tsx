import { motion } from 'motion/react';
import Link from 'next/link';

import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import type { Component } from '~/utils/type';

const COMPONENT_STAGGER_MULTIPLIER = 0.2;
const COMPONENT_BASE_DELAY = 0.3;

type ComponentsSectionProps = {
  components: Component[];
};

export function ComponentsSection({ components }: ComponentsSectionProps) {
  return (
    <motion.section
      className="space-y-24"
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
    >
      <section className="space-y-6">
        <h3 className="text-2xl">Components</h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {components.map((component, index) => (
            <div className="group space-y-2" key={component.slug}>
              <div className="relative rounded-xl border">
                <Link
                  key={component.slug}
                  rel="noopener noreferrer"
                  href={`/ui/components/${component.slug}`}
                >
                  <div className="group relative aspect-square rounded-2xl bg-zinc-50/40 ring-1 ring-zinc-200/50 transition-all duration-300 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl text-zinc-900 dark:text-zinc-50">
                      <img
                        alt={`${component.name} background`}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        height="400"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        src="/assets/background.svg"
                        width="400"
                      />
                      {component.preview && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-zinc-900 dark:text-zinc-50">{component.preview}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Discover Button */}
                <div className="absolute top-4 left-4">
                  <motion.div
                    className="overflow-hidden rounded-full border border-border bg-background"
                    initial={{ width: '0px', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    variants={{
                      hover: { width: 'auto', opacity: 1 },
                    }}
                  >
                    <motion.a
                      className="block px-4 py-2 text-sm font-medium whitespace-nowrap text-primary"
                      href={`/ui/components/${component.slug}`}
                      initial={{ opacity: 0 }}
                      rel="noopener noreferrer"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      variants={{
                        hover: { opacity: 1 },
                      }}
                    >
                      Discover
                    </motion.a>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="px-1 py-2"
                initial={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: index * COMPONENT_STAGGER_MULTIPLIER + COMPONENT_BASE_DELAY,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Link
                  className="group font-base relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                  rel="noopener noreferrer"
                  href={`/ui/components/${component.slug}`}
                >
                  {component.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50" />
                </Link>
                <p className="mt-2 font-sans text-sm text-zinc-600 dark:text-zinc-400">
                  {component.description}
                </p>
                {component.tags && component.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {component.tags.map((tag) => (
                      <span
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </motion.section>
  );
}
