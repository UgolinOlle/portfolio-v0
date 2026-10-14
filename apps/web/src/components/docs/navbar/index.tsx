import { Suspense } from 'react';

import { getRegistrySections } from '~/lib/registry';

import { GitHub, GitHubSkeleton } from './github';
import { NavbarClient } from './navbar-client';

// Same item lists as the /ui grids, so category index pages aren't counted as items.
const countByCategory = Object.fromEntries(
  getRegistrySections().map((section) => [section.category, section.items.length]),
);
const componentsCount = countByCategory.component ?? 0;
const blocksCount = countByCategory.block ?? 0;
const templatesCount = countByCategory.template ?? 0;

function Navbar() {
  return (
    <NavbarClient
      blocksCount={blocksCount}
      componentsCount={componentsCount}
      templatesCount={templatesCount}
      github={
        <Suspense fallback={<GitHubSkeleton />}>
          <GitHub />
        </Suspense>
      }
    />
  );
}

export { Navbar };
