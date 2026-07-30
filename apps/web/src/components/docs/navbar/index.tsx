import { Suspense } from 'react';

import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import { GitHub, GitHubSkeleton } from './github';
import { NavbarClient } from './navbar-client';

const componentsCount = componentsSource.getPages().length;
const blocksCount = blocksSource.getPages().length;
const templatesCount = templatesSource.getPages().length;

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
