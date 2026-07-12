import { Button } from '@portfolio-v0/shadcn/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@portfolio-v0/shadcn/components/drawer';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { blocksSource, componentsSource } from '~/lib/source';

const groups = [
  { title: 'Components', pages: componentsSource.getPages() },
  { title: 'Blocks', pages: blocksSource.getPages() },
];

export const MobileMenu = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button className="size-8" size="icon" variant="ghost">
        <MenuIcon size={16} />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="sr-only">
        <DrawerTitle>Mobile Menu</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col space-y-4 overflow-y-auto px-6 pt-8 pb-12">
        {groups.map((group) => (
          <div className="flex flex-col gap-2" key={group.title}>
            <p className="font-medium">{group.title}</p>
            {group.pages.map((page) => (
              <DrawerClose asChild key={page.url}>
                <Link className="text-muted-foreground" href={page.url}>
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
