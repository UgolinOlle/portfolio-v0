'use client';

import { LazyMotion, MotionConfig, domMax, m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ApprovalDetail } from './approval-detail';
import { ApprovalList } from './approval-list';
import {
  approvals as defaultApprovals,
  details as defaultDetails,
  stats as defaultStats,
} from './data';
import type { Approval, ApprovalDetailData, Stat } from './data';
import { enter, rise } from './motion';
import { SubHeader } from './sub-header';
import { TopNav } from './top-nav';

export type { Approval, ApprovalDetailData, Stat } from './data';
export { ApprovalCard } from './approval-card';
export { ApprovalDetail } from './approval-detail';
export { ApprovalList } from './approval-list';
export { BudgetBar } from './budget-bar';
export { EvidenceList } from './evidence-list';
export { SubHeader } from './sub-header';
export { TopNav } from './top-nav';
export { WorkflowTimeline } from './workflow-timeline';

export interface Dashboard1Props {
  approvals?: Approval[];
  /** Full detail content, keyed by approval id. */
  details?: Record<string, ApprovalDetailData>;
  stats?: Stat[];
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
  /** Fill the parent (which must have a height) instead of the viewport, e.g. in docs previews. */
  contained?: boolean;
  className?: string;
}

export function Dashboard1({
  approvals = defaultApprovals,
  details = defaultDetails,
  stats = defaultStats,
  defaultSelectedId,
  onSelect,
  contained = false,
  className,
}: Dashboard1Props) {
  const [selectedId, setSelectedId] = React.useState(defaultSelectedId ?? approvals[0]?.id ?? '');
  const selected = approvals.find((a) => a.id === selectedId) ?? approvals[0];

  const [interacted, setInteracted] = React.useState(false);

  const handleSelect = (id: string) => {
    setInteracted(true);
    setSelectedId(id);
    onSelect?.(id);
  };

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={enter}>
        <div
          className={cn(
            'flex flex-col gap-3 bg-slate-200/70 p-3 text-slate-900',
            contained ? 'h-full min-h-0' : 'h-screen',
            className,
          )}
        >
          <m.header
            animate="visible"
            className="shrink-0 rounded-[28px] bg-linear-to-br from-[#1b2a5c] via-[#16245a] to-[#1d3fa8]"
            initial="hidden"
            variants={rise}
          >
            <TopNav />
            <SubHeader stats={stats} />
          </m.header>

          <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto min-[1100px]:grid-cols-[minmax(320px,1fr)_2fr] min-[1100px]:overflow-hidden">
            <ApprovalList
              approvals={approvals}
              onSelect={handleSelect}
              selectedId={selected?.id ?? ''}
            />
            {selected && (
              <ApprovalDetail
                approval={selected}
                detail={details[selected.id]}
                key={selected.id}
                quick={interacted}
              />
            )}
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
