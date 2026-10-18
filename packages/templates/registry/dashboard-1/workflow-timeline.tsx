'use client';

import { CheckIcon, ClockIcon, ShoppingCartIcon } from 'lucide-react';
import { m } from 'motion/react';

import { cn } from '@/lib/utils';

import type { WorkflowStep } from './data';
import { InitialsAvatar } from './initials-avatar';
import { EASE_OUT_STRONG, rise, riseGroup, useQuick } from './motion';

function StepMark({ step }: { step: WorkflowStep }) {
  return (
    <span className="relative shrink-0">
      {step.kind === 'avatar' && step.person ? (
        <InitialsAvatar className="size-8 text-[11px]" name={step.person} />
      ) : (
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-full',
            step.state === 'upcoming' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-600',
          )}
        >
          <ShoppingCartIcon className="size-3.5" />
        </span>
      )}
      {step.state === 'done' && (
        <span className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
          <CheckIcon className="size-2.5" strokeWidth={3} />
        </span>
      )}
      {step.state === 'current' && (
        <span className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white">
          <ClockIcon className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </span>
  );
}

export function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  const quick = useQuick();

  return (
    <m.ol
      className="flex items-center gap-2 overflow-x-auto rounded-xl bg-slate-50 p-3"
      variants={riseGroup(quick, 0.07)}
    >
      {steps.map((step, i) => (
        <m.li className="flex min-w-0 flex-1 items-center gap-2" key={step.id} variants={rise}>
          <div
            className={cn(
              'flex min-w-0 items-center gap-2.5 rounded-lg',
              step.state === 'upcoming' && 'opacity-60',
            )}
          >
            <StepMark step={step} />
            <div className="min-w-0">
              <p
                className={cn(
                  'truncate text-xs font-semibold',
                  step.state === 'current' ? 'text-blue-700' : 'text-slate-900',
                )}
              >
                {step.title}
              </p>
              <p
                className={cn(
                  'truncate text-[11px]',
                  step.state === 'current' ? 'font-medium text-blue-600' : 'text-slate-500',
                )}
              >
                {step.caption}
              </p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <m.span
              aria-hidden
              className={cn(
                'h-px min-w-4 flex-1 origin-left',
                step.state === 'done' ? 'bg-emerald-400' : 'bg-slate-200',
              )}
              transition={{ duration: quick ? 0.16 : 0.4, ease: EASE_OUT_STRONG }}
              variants={{
                hidden: { transform: 'scaleX(0)' },
                visible: { transform: 'scaleX(1)' },
              }}
            />
          )}
        </m.li>
      ))}
    </m.ol>
  );
}
