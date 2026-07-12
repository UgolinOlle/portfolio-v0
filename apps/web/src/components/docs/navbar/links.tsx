'use client';

import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { navigationMenuTriggerStyle } from '@portfolio-v0/shadcn/components/navigation-menu';
import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinksProps = {
  className: string;
  componentsCount: number;
  blocksCount: number;
};

export const Links = ({ className, componentsCount, blocksCount }: LinksProps) => {
  const pathname = usePathname();

  const links = [
    {
      label: 'Components',
      href: '/ui/components',
      active: pathname.startsWith('/ui/components'),
      count: componentsCount,
    },
    {
      label: 'Blocks',
      href: '/ui/blocks',
      active: pathname.startsWith('/ui/blocks'),
      count: blocksCount,
    },
  ];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {links.map((link) => (
        <Link
          className={cn(
            navigationMenuTriggerStyle(),
            'h-auto bg-transparent px-3 py-1.5 shadow-none transition-all',
            link.active && 'bg-primary/10 text-primary',
          )}
          href={link.href}
          key={link.href}
        >
          {link.label}
          {Boolean(link.count) && (
            <Badge
              className={cn(
                'ml-1.5 hidden bg-foreground/5 lg:block',
                link.active && 'bg-primary text-primary-foreground',
              )}
              variant="secondary"
            >
              {link.count}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );
};
