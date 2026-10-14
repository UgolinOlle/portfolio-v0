import { cn } from '@portfolio-v0/shadcn/utils';

import { SiGithub } from '@icons-pack/react-simple-icons';

import { GITHUB_REPO } from '~/lib/constants';

type GitHubLinkProps = {
  // Fetched on the server (`getStarCount`) and passed down as a plain number.
  stars: number | null;
  className?: string;
};

export const GitHubLink = ({ stars, className }: GitHubLinkProps) => (
  <a
    aria-label={stars === null ? 'GitHub' : `GitHub — ${stars} étoiles`}
    className={cn(
      'flex items-center gap-2 border-s border-foreground/5 px-4 font-mono text-xs text-foreground/60 transition-colors',
      'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      className,
    )}
    href={`https://github.com/${GITHUB_REPO}`}
    rel="noreferrer"
    target="_blank"
  >
    <SiGithub aria-hidden="true" className="size-3.5" />
    {stars !== null && (
      <span className="tabular-nums">
        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(stars)}
      </span>
    )}
  </a>
);
