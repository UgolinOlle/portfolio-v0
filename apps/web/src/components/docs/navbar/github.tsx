import { cn } from '@portfolio-v0/shadcn/utils';

import { SiGithub } from '@icons-pack/react-simple-icons';

import { GITHUB_REPO as REPO } from '~/lib/constants';

const DAY = 86_400;

type GitHubProps = {
  className?: string;
};

async function getStarCount() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: DAY },
    });
    if (!res.ok) return null;
    const json: { stargazers_count?: number } = await res.json();
    return json.stargazers_count ?? null;
  } catch {
    return null;
  }
}

const GitHub = async ({ className }: GitHubProps) => {
  const stars = await getStarCount();

  return (
    <a
      aria-label={stars === null ? 'GitHub' : `GitHub — ${stars} étoiles`}
      className={cn(
        'flex items-center gap-2 border-s border-foreground/5 px-4 font-mono text-xs text-foreground/60 transition-colors',
        'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      href={`https://github.com/${REPO}`}
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
};

const GitHubSkeleton = () => (
  <div aria-hidden="true" className="w-16 border-s border-foreground/5" />
);

export { GitHubSkeleton, GitHub };
