import { Button } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import { SiGithub } from '@icons-pack/react-simple-icons';

const DAY = 86_400;

type GitHubProps = {
  className?: string;
};

export const GitHub = async ({ className }: GitHubProps) => {
  const data = await fetch('https://api.github.com/repos/ugolinolle/portfolio-v0', {
    // Cache for 1 day (86400 seconds)
    next: { revalidate: DAY },
  });
  const json = await data.json();

  return (
    <Button className={cn('h-8 rounded-lg shadow-none', className)} size="sm" variant="outline">
      <a
        className="flex items-center gap-1.5"
        href="https://github.com/shadcnblocks/kibo"
        rel="noreferrer"
        target="_blank"
      >
        <SiGithub />
        <span className="text-xs text-muted-foreground tabular-nums">
          {new Intl.NumberFormat('en-US', {
            notation: 'compact',
          }).format(json.stargazers_count)}
        </span>
      </a>
    </Button>
  );
};
