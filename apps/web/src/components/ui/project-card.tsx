import { Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { useTranslation } from '~/components/i18n/i18n-provider';

const CARD_ANIMATION_BASE_DELAY = 0.3;
const HEADER_ANIMATION_BASE_DELAY = 0.4;
const DATE_ANIMATION_BASE_DELAY = 0.5;
const DESCRIPTION_ANIMATION_BASE_DELAY = 0.5;
const TAGS_ANIMATION_BASE_DELAY = 0.6;
const STAGGER_DELAY_MULTIPLIER = 0.1;
const MAX_VISIBLE_TAGS = 3;

type ProjectCardProps = {
  slug: string;
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  index: number;
  lang?: string;
};

export function ProjectCard({
  slug,
  title,
  description,
  date,
  tags,
  index,
  lang = 'en',
}: ProjectCardProps) {
  const { t } = useTranslation();

  const projectUrl = lang === 'en' ? `/projects/${slug}` : `/projects/${slug}?lang=${lang}`;

  return (
    <Link href={projectUrl}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border transition-all duration-300 ring-inset"
        initial={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          delay: CARD_ANIMATION_BASE_DELAY + index * STAGGER_DELAY_MULTIPLIER,
          ease: 'easeOut',
        }}
        variants={{
          hover: {},
        }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover="hover"
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-full flex-col rounded-md bg-muted p-4 ring-1 ring-border/50">
            <motion.div
              className="mb-3 flex flex-wrap items-start justify-between"
              initial={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.3,
                delay: HEADER_ANIMATION_BASE_DELAY + index * STAGGER_DELAY_MULTIPLIER,
                ease: 'easeOut',
              }}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <motion.h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {title}
              </motion.h3>
              {date && (
                <motion.span
                  className="flex items-center gap-1 rounded-full bg-zinc-200/70 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                  initial={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: DATE_ANIMATION_BASE_DELAY + index * STAGGER_DELAY_MULTIPLIER,
                    ease: 'easeOut',
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileInView={{ opacity: 1 }}
                >
                  <Calendar size={10} />
                  {date}
                </motion.span>
              )}
            </motion.div>

            <motion.p
              className="mb-4 grow text-sm text-zinc-600 dark:text-zinc-400"
              initial={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                delay: DESCRIPTION_ANIMATION_BASE_DELAY + index * STAGGER_DELAY_MULTIPLIER,
                ease: 'easeOut',
              }}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {description}
            </motion.p>

            {tags && tags.length > 0 && (
              <motion.div
                className="mb-4 flex flex-wrap gap-1"
                initial={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: TAGS_ANIMATION_BASE_DELAY + index * STAGGER_DELAY_MULTIPLIER,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
                  <span
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    key={index}
                  >
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
                {tags.length > MAX_VISIBLE_TAGS && (
                  <span className="rounded-full bg-zinc-200/70 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300">
                    +{tags.length - MAX_VISIBLE_TAGS}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Discover Button */}
          <div className="absolute right-0 bottom-0 left-0 w-full overflow-hidden">
            <motion.div
              className="block w-full rounded-b-2xl bg-background py-2 text-center text-sm font-medium text-primary"
              initial={{ scaleY: 0 }}
              style={{
                borderColor: 'var(--border)',
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                transformOrigin: 'bottom',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              variants={{
                hover: {
                  scaleY: 1,
                  borderLeftWidth: '1px',
                  borderRightWidth: '1px',
                  borderBottomWidth: '1px',
                },
              }}
              whileInView={{
                scaleY: 0,
              }}
            >
              <motion.span
                className="whitespace-nowrap"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                variants={{
                  hover: { opacity: 1 },
                }}
              >
                {t('projects.readMore') || 'Read More'}
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
