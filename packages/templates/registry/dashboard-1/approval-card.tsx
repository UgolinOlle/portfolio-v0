'use client';

import { CalendarClockIcon, LightbulbIcon, ShoppingCartIcon, TruckIcon } from 'lucide-react';
import { m } from 'motion/react';

import { cn } from '@/lib/utils';

import type { Approval, ApprovalIcon, ApprovalStatus } from './data';
import { InitialsAvatar } from './initials-avatar';
import { rise, slide } from './motion';

const icons: Record<ApprovalIcon, React.ComponentType<{ className?: string }>> = {
  cart: ShoppingCartIcon,
  calendar: CalendarClockIcon,
  lighting: LightbulbIcon,
  truck: TruckIcon,
};

export const statusStyles: Record<
  Exclude<ApprovalStatus, 'open'>,
  { label: string; className: string }
> = {
  'due-today': { label: 'Due today', className: 'bg-amber-100 text-amber-800' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
};

export function StatusTag({ status }: { status: ApprovalStatus }) {
  if (status === 'open') return null;
  const { label, className } = statusStyles[status];
  return (
    <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', className)}>{label}</span>
  );
}

export function ApprovalCard({
  approval,
  selected,
  selectionId,
  onSelect,
}: {
  approval: Approval;
  selected: boolean;
  /** `layoutId` of the highlight that slides between cards. */
  selectionId: string;
  onSelect: (id: string) => void;
}) {
  const Icon = icons[approval.icon];
  const isYou = approval.section === 'you';

  return (
    <m.div variants={rise}>
      <button
        aria-pressed={selected}
        className="relative flex w-full flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none hover:border-slate-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.985]"
        onClick={() => onSelect(approval.id)}
        type="button"
      >
        {selected && (
          <m.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-xl border border-blue-500 bg-blue-50/40 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
            layoutId={selectionId}
            transition={slide}
          />
        )}
        <span className="relative flex items-start gap-2.5">
          <span
            className={cn(
              'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150',
              selected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500',
            )}
          >
            <Icon className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-slate-900">
              {approval.id} · {approval.title}
            </span>
            <span className="block truncate text-xs text-slate-500">{approval.subtitle}</span>
          </span>
          <span className="text-[13px] font-semibold whitespace-nowrap text-slate-900">
            {approval.amount}
          </span>
        </span>

        <span className="relative flex items-center gap-2 text-xs text-slate-500">
          <InitialsAvatar name={approval.person} />
          {isYou ? (
            <span className="font-medium text-slate-700">
              {approval.person} <span className="font-normal text-slate-500">· {approval.ago}</span>
            </span>
          ) : (
            <span>Waiting on {approval.person}</span>
          )}
          <span className="ml-auto">
            {isYou ? (
              <StatusTag status={approval.status} />
            ) : (
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                Open
              </span>
            )}
          </span>
        </span>
      </button>
    </m.div>
  );
}
