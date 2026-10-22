import type { Metadata } from 'next';

import { JsonLd } from '~/components/core/json-ld';
import { HomeContent } from '~/components/sections/home-section';
import { RecentWritingsLoader } from '~/components/writings/recent-writings-loader';
import { homeSchema } from '~/lib/structured-data';

// The root layout carries no canonical: each route declares its own.
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return (
    <>
      <JsonLd data={homeSchema()} />
      <HomeContent recentWritings={<RecentWritingsLoader />} />
    </>
  );
}
