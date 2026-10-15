import { getRegistrySections } from '~/lib/registry';
import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { getStarCount } from './github';
import type { MobileMenuGroup } from './mobile-menu';
import { NavbarClient, type NavbarVariant } from './navbar-client';

const toMenuPages = (pages: ReturnType<typeof componentsSource.getPages>) =>
  pages.map((page) => ({ title: page.data.title, url: page.url }));

const menuGroups: MobileMenuGroup[] = [
  { key: 'components', title: 'Composants', pages: toMenuPages(componentsSource.getPages()) },
  { key: 'blocks', title: 'Blocks', pages: toMenuPages(blocksSource.getPages()) },
  { key: 'templates', title: 'Templates', pages: toMenuPages(templatesSource.getPages()) },
];

type NavbarProps = {
  variant?: NavbarVariant;
};

// Same item lists as the /ui grids, so category index pages aren't counted as items.
const countByCategory = Object.fromEntries(
  getRegistrySections().map((section) => [section.category, section.items.length]),
);

const counts = {
  components: countByCategory.component ?? 0,
  blocks: countByCategory.block ?? 0,
  templates: countByCategory.template ?? 0,
};

// Async so the star count reaches the client navbar as data. Passing a suspended server
// component through it instead triggered React's "unique key" warning.
async function Navbar({ variant = 'docs' }: NavbarProps) {
  const githubStars = await getStarCount();

  return (
    <NavbarClient
      blocksCount={counts.blocks}
      componentsCount={counts.components}
      menuGroups={menuGroups}
      templatesCount={counts.templates}
      variant={variant}
      githubStars={githubStars}
    />
  );
}

export { Navbar };
