'use client';

import { CheckIcon } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';

import { EASE_OUT_STRONG } from './motion';

export type ToastMessage = { id: number; text: string };

/** Single-slot toast. A new message replaces the old one (keyed), so rapid actions retarget. */
export function Toast({ message }: { message: ToastMessage | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-5 z-[60] flex justify-center"
    >
      <AnimatePresence mode="popLayout">
        {message && (
          <m.div
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1c] pr-4 pl-2.5 text-[12px] font-medium text-(--d2-fg) shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8)]"
            exit={{
              opacity: 0,
              transform: 'translateY(8px) scale(0.97)',
              transition: { duration: 0.14 },
            }}
            initial={{ opacity: 0, transform: 'translateY(12px) scale(0.97)' }}
            key={message.id}
            transition={{ duration: 0.25, ease: EASE_OUT_STRONG }}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckIcon aria-hidden className="size-3" strokeWidth={2.6} />
            </span>
            {message.text}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
