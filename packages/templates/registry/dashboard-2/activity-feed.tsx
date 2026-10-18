'use client';

import { ArrowRightLeftIcon, MailIcon, PhoneIcon, StickyNoteIcon, TrophyIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { m } from 'motion/react';

import type { ActivityEntry, ActivityKind } from './data';
import { rise, stagger } from './motion';

const kinds: Record<ActivityKind, { icon: LucideIcon; color: string }> = {
  won: { icon: TrophyIcon, color: '#34d399' },
  email: { icon: MailIcon, color: '#4f8cff' },
  call: { icon: PhoneIcon, color: '#ff6b2c' },
  stage: { icon: ArrowRightLeftIcon, color: '#a78bfa' },
  note: { icon: StickyNoteIcon, color: '#9a9a9a' },
};

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <section
      aria-labelledby="d2-activity"
      className="rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <h2 className="text-[16px] font-medium text-(--d2-fg)" id="d2-activity">
        Team activity
      </h2>
      <m.ol animate="visible" className="mt-4" initial="hidden" variants={stagger(0.05, 0.06)}>
        {entries.map((e, i) => {
          const { icon: Icon, color } = kinds[e.kind];
          return (
            <m.li className="relative flex gap-3 pb-5 last:pb-0" key={e.id} variants={rise}>
              {i < entries.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-8 bottom-0 left-[13px] w-px bg-(--d2-line)"
                />
              )}
              <span
                aria-hidden
                className="relative flex size-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${color}22`, color }}
              >
                <Icon className="size-3.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5 text-[13px] text-(--d2-muted)">
                <p>
                  <span className="font-medium text-(--d2-fg)">{e.who}</span> {e.text}{' '}
                  <span className="font-medium text-(--d2-fg)">{e.target}</span>
                </p>
              </div>
              <time className="shrink-0 pt-0.5 text-[11px] text-(--d2-dim)">{e.time}</time>
            </m.li>
          );
        })}
      </m.ol>
    </section>
  );
}
