'use client';

import { GitFork, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useTranslation } from '~/components/i18n/i18n-provider';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

const BASE_ANIMATION_DELAY = 0.5;
const ITEM_DELAY_MULTIPLIER = 0.1;
const ANIMATION_DURATION_SHORT = 0.3;
const ANIMATION_DURATION_MEDIUM = 0.4;
const ANIMATION_DURATION_LONG = 0.6;
const SECTION_INITIAL_DELAY = 0.2;
const CARD_BASE_DELAY = 0.3;
const TITLE_BASE_DELAY = 0.4;
const STATS_BASE_DELAY = 0.6;
const BUTTON_HOVER_DELAY = 0.15;
const BUTTON_HOVER_DURATION = 0.2;

type GitHubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export function GitHubProjectsSection() {
  const { t } = useTranslation();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/UgolinOlle/repos?sort=updated&per_page=6',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center py-12"
        transition={TRANSITION_SECTION}
        variants={VARIANTS_SECTION}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="py-12 text-center"
        transition={TRANSITION_SECTION}
        variants={VARIANTS_SECTION}
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          Failed to load GitHub repositories: {error}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="relative space-y-6"
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
    >
      <motion.h3
        className="text-2xl tracking-tight text-zinc-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: ANIMATION_DURATION_SHORT, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t('projects.githubTitle')}
      </motion.h3>
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{
          duration: ANIMATION_DURATION_LONG,
          delay: SECTION_INITIAL_DELAY,
          ease: 'easeOut',
        }}
        viewport={{ once: true, margin: '-100px' }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {repos.map((repo, index) => (
          <motion.div
            className="group relative overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border transition-all duration-300 ring-inset"
            initial={{ opacity: 0, y: 20 }}
            key={repo.id}
            transition={{
              duration: ANIMATION_DURATION_MEDIUM,
              delay: CARD_BASE_DELAY + index * ITEM_DELAY_MULTIPLIER,
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
                    duration: ANIMATION_DURATION_SHORT,
                    delay: TITLE_BASE_DELAY + index * ITEM_DELAY_MULTIPLIER,
                    ease: 'easeOut',
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <motion.a
                    className="font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                    href={repo.html_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {repo.name}
                  </motion.a>
                  {repo.language && (
                    <motion.span
                      className="rounded-full bg-zinc-200/70 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                      initial={{ opacity: 0 }}
                      transition={{
                        duration: ANIMATION_DURATION_SHORT,
                        delay: BASE_ANIMATION_DELAY + index * ITEM_DELAY_MULTIPLIER,
                        ease: 'easeOut',
                      }}
                      viewport={{ once: true, margin: '-50px' }}
                      whileInView={{ opacity: 1 }}
                    >
                      {repo.language}
                    </motion.span>
                  )}
                </motion.div>

                <motion.p
                  className="mb-4 flex-grow text-sm text-zinc-600 dark:text-zinc-400"
                  initial={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.4,
                    delay: BASE_ANIMATION_DELAY + index * ITEM_DELAY_MULTIPLIER,
                    ease: 'easeOut',
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {repo.description || 'No description available'}
                </motion.p>
              </div>

              <motion.div
                className="my-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500"
                initial={{ opacity: 0, y: 10 }}
                transition={{
                  duration: ANIMATION_DURATION_MEDIUM,
                  delay: STATS_BASE_DELAY + index * ITEM_DELAY_MULTIPLIER,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-1">
                    <Star size={12} /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} /> {repo.forks_count}
                  </span>
                </div>
                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              </motion.div>

              <div className="absolute right-0 bottom-0 left-0 overflow-hidden">
                <motion.a
                  animate={{
                    width: '0%',
                  }}
                  className="block rounded-b-2xl bg-card py-2 text-center text-sm font-medium text-primary"
                  href={repo.html_url}
                  initial={{ width: '0%' }}
                  rel="noopener noreferrer"
                  style={{
                    borderColor: 'var(--border)',
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                  }}
                  target="_blank"
                  transition={{
                    duration: ANIMATION_DURATION_SHORT,
                    ease: 'easeOut',
                  }}
                  variants={{
                    hover: {
                      width: '100%',
                      borderLeftWidth: '1px',
                      borderRightWidth: '1px',
                      borderBottomWidth: '1px',
                    },
                  }}
                  whileInView={{
                    width: '0%',
                  }}
                >
                  <motion.span
                    className="whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    transition={{
                      delay: BUTTON_HOVER_DELAY,
                      duration: BUTTON_HOVER_DURATION,
                    }}
                    variants={{
                      hover: { opacity: 1 },
                    }}
                  >
                    {t('projects.discover')}
                  </motion.span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
