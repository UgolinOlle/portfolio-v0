'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@portfolio-v0/shadcn/components/drawer';
import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BlockIcon, ComponentIcon, TemplateIcon } from '~/components/icons';
import { ArrowUpRightIcon, MenuIcon } from '~/components/icons/ui';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';

const GROUP_ICONS = {
  components: ComponentIcon,
  blocks: BlockIcon,
  templates: TemplateIcon,
};

// Plain data computed on the server (see `./index.tsx`) so the fumadocs sources
// never end up in the client bundle.
export type MobileMenuGroup = {
  key: keyof typeof GROUP_ICONS;
  title: string;
  pages: { title: string; url: string }[];
};

type MobileMenuProps = {
  groups: MobileMenuGroup[];
};

const MobileMenu = ({ groups }: MobileMenuProps) => {
  const pathname = usePathname();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          aria-label="Ouvrir le menu"
          className="h-full w-(--nav-height) rounded-none border-s border-foreground/5"
          size="icon"
          variant="ghost"
        >
          <MenuIcon size={16} />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="flex-row items-center justify-between border-b pb-4">
          <DrawerTitle className="text-base font-semibold">Menu</DrawerTitle>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm',
                'font-medium transition-colors hover:bg-accent',
              )}
            >
              Portfolio
              <ArrowUpRightIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
            </Link>

            <ThemeSwitch />
          </div>
        </DrawerHeader>

        <nav aria-label="Registre" className="flex flex-col gap-6 overflow-y-auto px-6 py-6">
          {groups.map((group) => {
            const Icon = GROUP_ICONS[group.key];

            return (
              <div className="flex flex-col gap-1" key={group.key}>
                <p className="mb-1 flex items-center gap-1.5 px-2 text-xs font-medium tracking-wide text-foreground/70 uppercase">
                  <Icon className="size-3.5" />
                  {group.title}
                </p>
                {group.pages.map((page) => {
                  const active = pathname === page.url;

                  return (
                    <DrawerClose asChild key={page.url}>
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                          active && 'bg-accent font-medium text-foreground',
                        )}
                        href={page.url}
                      >
                        {page.title}
                      </Link>
                    </DrawerClose>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export { MobileMenu };
