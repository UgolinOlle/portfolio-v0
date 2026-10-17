'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

export default function Demo() {
  return (
    <Menubar>
      {['File', 'Edit', 'View'].map((name) => (
        <MenubarMenu key={name}>
          <MenubarTrigger>{name}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Close</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
