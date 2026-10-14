import type { Metadata } from 'next';

import { PortfolioShell } from '~/components/core/portfolio-shell';
import { InspirationsContent } from '~/components/sections/inspirations-section';
import { ResourcesSection } from '~/components/sections/resources-section';
import { createMetadata } from '~/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Inspirations design et interactions web',
  description:
    "Les inspirations visuelles, techniques et d'interaction qui ont nourri la conception de ce portfolio et de ses composants.",
  pathname: '/inspirations',
});

export default function InspirationsPage() {
  return (
    <PortfolioShell>
      <InspirationsContent />
      {/* Gear and tools: moved off the landing page, which stays focused on client work. */}
      <div className="mt-24">
        <ResourcesSection />
      </div>
    </PortfolioShell>
  );
}
