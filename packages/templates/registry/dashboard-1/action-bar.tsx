'use client';

import { AnimatePresence, m } from 'motion/react';

import { cn } from '@/lib/utils';

import { EASE_OUT_STRONG, rise } from './motion';

export type Decision = 'approved' | 'approved-with-change' | 'rejected';

const decisionLabel: Record<Decision, string> = {
  approved: 'Approved',
  'approved-with-change': 'Approved with change',
  rejected: 'Rejected',
};

export function ActionBar({
  nextStep,
  approveLabel,
  decision,
  onDecide,
}: {
  nextStep: string;
  approveLabel: string;
  decision?: Decision;
  onDecide: (decision: Decision) => void;
}) {
  const button =
    'h-9 rounded-lg px-4 text-xs font-semibold transition-[background-color,transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 enabled:active:scale-[0.97] disabled:opacity-50';
  const label = decision ? decisionLabel[decision] : 'What happens next';

  return (
    <m.div
      className="sticky bottom-0 mx-3 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 py-2.5"
      variants={rise}
    >
      <p className="max-w-md text-xs text-slate-600">
        <span className="relative block h-4 overflow-hidden font-semibold text-blue-700">
          <AnimatePresence initial={false} mode="wait">
            <m.span
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              className="block"
              exit={{ opacity: 0, transform: 'translateY(-4px)' }}
              initial={{ opacity: 0, transform: 'translateY(4px)' }}
              key={label}
              transition={{ duration: 0.12, ease: EASE_OUT_STRONG }}
            >
              {label}
            </m.span>
          </AnimatePresence>
        </span>
        {nextStep}
      </p>
      <div className="flex items-center gap-2">
        <button
          className={cn(button, 'bg-red-100 text-red-700 hover:bg-red-200')}
          disabled={!!decision}
          onClick={() => onDecide('rejected')}
          type="button"
        >
          Reject
        </button>
        <button
          className={cn(button, 'bg-white text-blue-700 hover:bg-blue-100')}
          disabled={!!decision}
          onClick={() => onDecide('approved-with-change')}
          type="button"
        >
          Approve with change
        </button>
        <button
          className={cn(button, 'bg-blue-600 text-white hover:bg-blue-700')}
          disabled={!!decision}
          onClick={() => onDecide('approved')}
          type="button"
        >
          {approveLabel}
        </button>
      </div>
    </m.div>
  );
}
