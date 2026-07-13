'use client';

import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinksProps = {
  className?: string;
  componentsCount: number;
  blocksCount: number;
  templatesCount: number;
};

export const Links = ({ className, componentsCount, blocksCount, templatesCount }: LinksProps) => {
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
    {
      label: 'Templates',
      href: '/ui/templates',
      active: pathname.startsWith('/ui/templates'),
      count: templatesCount,
    },
  ];

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {links.map((link) => (
        <Link
          className={cn(
            'relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
            'hover:text-foreground',
            link.active && 'text-foreground',
          )}
          href={link.href}
          key={link.href}
        >
          {link.active && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              layoutId="navbar-active-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          {link.label}
          {Boolean(link.count) && (
            <Badge
              className={cn(
                'hidden bg-foreground/5 tabular-nums lg:inline-flex',
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
