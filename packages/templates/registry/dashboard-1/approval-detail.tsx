'use client';

import { MotionConfig, m } from 'motion/react';
import * as React from 'react';

import { ActionBar } from './action-bar';
import type { Decision } from './action-bar';
import { StatusTag } from './approval-card';
import { BudgetBar } from './budget-bar';
import type { Approval, ApprovalDetailData } from './data';
import { EvidenceList } from './evidence-list';
import { InitialsAvatar } from './initials-avatar';
import { QuickContext, enter, enterQuick, rise, stagger } from './motion';
import { WorkflowTimeline } from './workflow-timeline';

export function ApprovalDetail({
  approval,
  detail,
  quick = false,
}: {
  approval: Approval;
  /** Full detail content. Approvals without it show a summary only. */
  detail?: ApprovalDetailData;
  /** Skip the staggered entrance (set once the user is selecting between approvals). */
  quick?: boolean;
}) {
  const [decisions, setDecisions] = React.useState<Record<string, Decision>>({});

  return (
    <QuickContext.Provider value={quick}>
      <MotionConfig transition={quick ? enterQuick : enter}>
        <m.div
          animate="visible"
          className="flex min-h-0 flex-col rounded-2xl bg-white shadow-sm"
          initial="hidden"
          variants={stagger(quick, 0.14, 0.05)}
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <m.header className="flex items-start justify-between gap-4" variants={rise}>
              <div className="min-w-0">
                <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900">
                  {approval.id} · {approval.title}
                  <StatusTag status={approval.status} />
                </h2>
                <p className="mt-1 text-xs text-slate-500">{detail?.meta ?? approval.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-slate-900">{approval.amount}</p>
                {detail && <p className="text-[11px] text-slate-500">{detail.amountCaption}</p>}
              </div>
            </m.header>

            {detail ? (
              <>
                <WorkflowTimeline steps={detail.steps} />
                <BudgetBar budget={detail.budget} />
                <EvidenceList items={detail.evidence} />
                <m.figure
                  className="flex gap-3 rounded-xl border border-slate-200 p-3"
                  variants={rise}
                >
                  <InitialsAvatar className="size-8 text-[11px]" name={detail.comment.author} />
                  <figcaption className="min-w-0 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{detail.comment.author}</span>{' '}
                    <span className="text-slate-500">
                      {detail.comment.role} · {detail.comment.context}
                    </span>
                    <blockquote className="mt-1 text-[13px] text-slate-800">
                      {detail.comment.body}
                    </blockquote>
                  </figcaption>
                </m.figure>
              </>
            ) : (
              <m.div
                className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-16 text-center"
                variants={rise}
              >
                <InitialsAvatar className="size-9 text-xs" name={approval.person} />
                <p className="text-sm font-medium text-slate-900">
                  {approval.section === 'team' ? `Waiting on ${approval.person}` : approval.person}
                </p>
                <p className="max-w-xs text-xs text-slate-500">
                  Evidence and workflow for {approval.id} are not part of this demo. Select BC-0193
                  for the full view.
                </p>
              </m.div>
            )}
          </div>

          {detail && (
            <ActionBar
              approveLabel={detail.approveLabel}
              decision={decisions[approval.id]}
              nextStep={detail.nextStep}
              onDecide={(d) => setDecisions((prev) => ({ ...prev, [approval.id]: d }))}
            />
          )}
        </m.div>
      </MotionConfig>
    </QuickContext.Provider>
  );
}
