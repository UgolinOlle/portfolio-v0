'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

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
    { label: 'Composants', href: '/ui/components', count: componentsCount },
    { label: 'Blocks', href: '/ui/blocks', count: blocksCount },
    { label: 'Templates', href: '/ui/templates', count: templatesCount },
  ];

  return (
    <ul className={cn('flex items-stretch', className)}>
      {links.map((link) => {
        const active = pathname.startsWith(link.href);

        return (
          <li className="flex" key={link.href}>
            <Link
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-2 border-e border-foreground/5 px-5 font-mono text-[0.6875rem] tracking-widest text-foreground/55 uppercase transition-colors',
                'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                // The indicator sits on the header's bottom hairline.
                active &&
                  'bg-foreground/3 text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-foreground',
              )}
              href={link.href}
            >
              {link.label}
              {link.count > 0 && (
                <span className="text-foreground/35 tabular-nums">
                  {String(link.count).padStart(2, '0')}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
