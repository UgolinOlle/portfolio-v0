import type { Metadata } from 'next';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { InspirationsContent } from '~/components/sections/inspirations-section';
import { createMetadata } from '~/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Inspirations',
  description:
    "Les inspirations visuelles, techniques et d'interaction qui ont nourri la conception de ce portfolio et de ses composants.",
  pathname: '/inspirations',
});

export default function InspirationsPage() {
  return (
    <PortfolioShell>
      <InspirationsContent />
    </PortfolioShell>
  );
}
