import { Button } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import { SiGithub } from '@icons-pack/react-simple-icons';

const DAY = 86_400;
const REPO = 'ugolinolle/portfolio-v0';

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

export const GitHub = async ({ className }: GitHubProps) => {
  const stars = await getStarCount();

  return (
    <Button
      asChild
      className={cn('h-8 rounded-full shadow-none transition-transform hover:scale-105', className)}
      size="sm"
      variant="outline"
    >
      <a
        className="flex items-center gap-1.5"
        href={`https://github.com/${REPO}`}
        rel="noreferrer"
        target="_blank"
      >
        <SiGithub className="size-3.5" />
        {stars !== null && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
            }).format(stars)}
          </span>
        )}
      </a>
    </Button>
  );
};
