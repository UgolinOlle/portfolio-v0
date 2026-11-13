import { cn } from '@portfolio-v0/shadcn/utils';

import Image from 'next/image';
import type { ReactNode } from 'react';

type Art = { bg: string; art: ReactNode };

const FILL = 'absolute inset-0 size-full';

/** Full-bleed artwork per project: each tile reads as a finished app icon, not a logo in a box. */
const ART: Record<string, Art> = {
  'whoa-ui': {
    bg: 'bg-[linear-gradient(150deg,#8B5CF6,#3B0A9E)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'object-cover')}
        fill
        sizes="80px"
        src="/favicon.ico"
        unoptimized
      />
    ),
  },
  'whoa-type': {
    bg: 'bg-[linear-gradient(160deg,#FFFBF5,#E4D8C6)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'scale-[1.2] object-contain')}
        fill
        sizes="80px"
        src="/assets/projects/whoa-type/whoa-type-logo.png"
        unoptimized
      />
    ),
  },
  'whoa-stash': {
    bg: 'bg-[#0C7A50]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'scale-[1.14] object-cover')}
        fill
        sizes="80px"
        src="/assets/projects/whoa-stash/icon-master.svg"
        unoptimized
      />
    ),
  },
  'claude-kit': {
    bg: 'bg-[linear-gradient(160deg,#3A332D,#110F0D)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'p-[19%] drop-shadow-[0_2px_6px_rgb(217_119_87/0.45)]')}
        fill
        sizes="80px"
        src="/assets/projects/claude-kit/claude-code-logo.svg"
        unoptimized
      />
    ),
  },
  'whoa-jobs': {
    bg: 'bg-[linear-gradient(160deg,#FF8A4C,#E5400F)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'p-[17%] drop-shadow-[0_2px_4px_rgb(120_20_0/0.35)]')}
        fill
        sizes="80px"
        src="/assets/projects/whoa-jobs/logo/whoa-jobs-symbol-white.png"
        unoptimized
      />
    ),
  },
  calyx: {
    bg: 'bg-[linear-gradient(145deg,#F6FCF8,#BFE6D1)] dark:bg-[linear-gradient(145deg,#16382A,#07120C)]',
    art: (
      <>
        <Image
          alt=""
          className={cn(FILL, 'scale-[1.06] object-cover dark:hidden')}
          fill
          sizes="80px"
          src="/assets/projects/calyx/icon-light.svg"
          unoptimized
        />
        <Image
          alt=""
          className={cn(FILL, 'hidden scale-[1.06] object-cover dark:block')}
          fill
          sizes="80px"
          src="/assets/projects/calyx/icon-dark.svg"
          unoptimized
        />
      </>
    ),
  },
  'whoa-bar': {
    bg: 'bg-[linear-gradient(180deg,#FF9F45,#FF3B6B)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'scale-[1.14] object-cover')}
        fill
        sizes="80px"
        src="/assets/projects/whoa-bar/whoa-bar-logo.svg"
        unoptimized
      />
    ),
  },
  'neovim-config': {
    bg: 'bg-[linear-gradient(160deg,#27393F,#0A1012)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'p-[21%] drop-shadow-[0_2px_8px_rgb(87_161_67/0.5)]')}
        fill
        sizes="80px"
        src="/assets/projects/neovim-config/neovim-logo.svg"
        unoptimized
      />
    ),
  },
  '42': {
    bg: 'bg-[linear-gradient(160deg,#303034,#000)]',
    art: (
      <Image
        alt=""
        className={cn(FILL, 'p-[25%] invert')}
        fill
        sizes="80px"
        src="/assets/logos/42.svg"
        unoptimized
      />
    ),
  },
};

export function ProjectTile({ id, fallback }: { id: string; fallback?: ReactNode }) {
  const art = ART[id];

  return (
    <span
      className={cn(
        'relative block size-20 overflow-hidden rounded-[22.5%] bg-zinc-100',
        art?.bg,
        'shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_18px_-6px_rgb(0_0_0/0.35)]',
      )}
    >
      {art ? art.art : <span className="grid size-full place-items-center">{fallback}</span>}
      {/* Gloss: light catching the top edge, a touch of depth at the bottom, a hairline rim. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit]',
          'bg-gradient-to-b from-white/25 via-transparent to-black/10',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.4)] ring-1 ring-black/10 ring-inset',
        )}
      />
    </span>
  );
}
