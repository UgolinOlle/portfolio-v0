import type { Metadata } from 'next';

import { NotFoundContent } from '~/components/core/not-found-content';

// Replaces the root `robots` (index, follow) and drops the home page's canonical / social tags.
export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
