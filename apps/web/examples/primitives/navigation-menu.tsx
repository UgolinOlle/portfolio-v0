'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const SECTIONS = {
  Products: ['Analytics', 'Automation', 'Insights'],
  Resources: ['Docs', 'Guides', 'Changelog', 'Support'],
};

export default function Demo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Object.entries(SECTIONS).map(([name, links]) => (
          <NavigationMenuItem key={name}>
            <NavigationMenuTrigger>{name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-48 gap-1">
                {links.map((link) => (
                  <li key={link}>
                    <NavigationMenuLink href="#">{link}</NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
