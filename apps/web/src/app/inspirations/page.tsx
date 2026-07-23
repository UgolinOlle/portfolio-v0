import type { Metadata } from 'next';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { InspirationsContent } from '~/components/sections/inspirations-section';
import { defaultMetadata } from '~/utils/metadata';

export const metadata: Metadata = defaultMetadata;

export default function InspirationsPage() {
  return (
    <div className="group/layout relative mx-auto w-full flex-1 px-4 py-20 pt-24 font-sans lg:max-w-3xl">
      <Header />
      <InspirationsContent />
      <Footer />
    </div>
  );
}
