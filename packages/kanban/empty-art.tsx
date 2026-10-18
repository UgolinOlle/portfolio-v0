import * as React from 'react';

import type { KanbanArt } from './types';

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

/* Static line illustrations tinted by the column accent (`currentColor`). */
const ART: Record<KanbanArt, React.ReactNode> = {
  inbox: (
    <>
      <rect x="38" y="14" width="44" height="28" rx="6" fill="currentColor" opacity=".16" />
      <path d="M46 24h22M46 32h14" {...stroke} />
      <path
        d="M18 54 30 40h60l12 14v22a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V54Z"
        fill="currentColor"
        opacity=".1"
      />
      <path d="M18 54h28a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6h28" {...stroke} />
    </>
  ),
  rocket: (
    <>
      <path d="M60 12c14 10 20 28 16 50H44c-4-22 2-40 16-50Z" fill="currentColor" opacity=".16" />
      <path d="M60 12c14 10 20 28 16 50H44c-4-22 2-40 16-50Z" {...stroke} />
      <circle cx="60" cy="38" r="6" fill="currentColor" />
      <path d="M44 52 32 66l14-3M76 52l12 14-14-3M52 68c2 8 6 12 8 16 2-4 6-8 8-16" {...stroke} />
    </>
  ),
  lens: (
    <>
      <circle cx="54" cy="44" r="24" fill="currentColor" opacity=".12" />
      <circle cx="54" cy="44" r="24" {...stroke} />
      <path d="m72 62 18 18" {...stroke} strokeWidth={5} />
      <path d="M43 44c4-8 18-8 22 0" {...stroke} opacity=".6" />
    </>
  ),
  flag: (
    <>
      <path d="M38 84V18" {...stroke} strokeWidth={3.5} />
      <path d="M38 20c14-8 22 8 38 0v32c-16 8-24-8-38 0V20Z" fill="currentColor" opacity=".75" />
      <circle cx="88" cy="28" r="3" fill="currentColor" opacity=".4" />
      <circle cx="96" cy="48" r="3" fill="currentColor" opacity=".4" />
      <circle cx="82" cy="64" r="3" fill="currentColor" opacity=".4" />
    </>
  ),
  spark: (
    <>
      <path
        d="M60 14 68 40 94 48 68 56 60 82 52 56 26 48 52 40Z"
        fill="currentColor"
        opacity=".16"
      />
      <path d="M60 14 68 40 94 48 68 56 60 82 52 56 26 48 52 40Z" {...stroke} />
    </>
  ),
};

export function EmptyArt({ art }: { art: KanbanArt }) {
  return (
    <svg
      viewBox="0 0 120 96"
      width="96"
      height="77"
      aria-hidden
      className="mx-auto text-[var(--kb-accent)]"
    >
      {ART[art]}
    </svg>
  );
}
