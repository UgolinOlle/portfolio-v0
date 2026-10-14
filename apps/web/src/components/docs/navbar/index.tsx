import { Suspense } from 'react';

import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { GitHub, GitHubSkeleton } from './github';
import type { MobileMenuGroup } from './mobile-menu';
import { NavbarClient, type NavbarVariant } from './navbar-client';

const toMenuPages = (pages: ReturnType<typeof componentsSource.getPages>) =>
  pages.map((page) => ({ title: page.data.title, url: page.url }));

const menuGroups: MobileMenuGroup[] = [
  { key: 'components', title: 'Components', pages: toMenuPages(componentsSource.getPages()) },
  { key: 'blocks', title: 'Blocks', pages: toMenuPages(blocksSource.getPages()) },
  { key: 'templates', title: 'Templates', pages: toMenuPages(templatesSource.getPages()) },
];

type NavbarProps = {
  variant?: NavbarVariant;
};

// Section index pages (`index.mdx`) introduce a category; they aren't registry items.
const itemCount = (pages: ReturnType<typeof componentsSource.getPages>) =>
  pages.filter((page) => page.slugs.length > 0).length;

const counts = {
  components: itemCount(componentsSource.getPages()),
  blocks: itemCount(blocksSource.getPages()),
  templates: itemCount(templatesSource.getPages()),
};

function Navbar({ variant = 'docs' }: NavbarProps) {
  return (
    <NavbarClient
      blocksCount={counts.blocks}
      componentsCount={counts.components}
      menuGroups={menuGroups}
      templatesCount={counts.templates}
      variant={variant}
      github={
        <Suspense fallback={<GitHubSkeleton />}>
          <GitHub />
        </Suspense>
      }
    />
  );
}

export { Navbar };
