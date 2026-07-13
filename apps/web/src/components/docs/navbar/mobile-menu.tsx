import { Button } from '@portfolio-v0/shadcn/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@portfolio-v0/shadcn/components/drawer';

import { Blocks, LayoutGrid, LayoutTemplate, MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { ThemeToggle } from './theme-toggle';

const groups = [
  { title: 'Components', pages: componentsSource.getPages(), icon: LayoutGrid },
  { title: 'Blocks', pages: blocksSource.getPages(), icon: Blocks },
  { title: 'Templates', pages: templatesSource.getPages(), icon: LayoutTemplate },
];

export const MobileMenu = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button className="size-8" size="icon" variant="ghost">
        <MenuIcon size={16} />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="flex-row items-center justify-between border-b pb-4">
        <DrawerTitle className="text-base font-semibold">Menu</DrawerTitle>
        <ThemeToggle />
      </DrawerHeader>
      <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6">
        {groups.map((group) => (
          <div className="flex flex-col gap-1" key={group.title}>
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <group.icon className="size-3.5" />
              {group.title}
            </p>
            {group.pages.map((page) => (
              <DrawerClose asChild key={page.url}>
                <Link
                  className="rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  href={page.url}
                >
                  {page.data.title}
                </Link>
              </DrawerClose>
            ))}
          </div>
        ))}
      </div>
    </DrawerContent>
  </Drawer>
);
