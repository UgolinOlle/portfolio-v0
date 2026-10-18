'use client';

import { m } from 'motion/react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { list, rise } from './motion';

/*
  Placeholder app content: the part of the block you replace. It is kept apart from the shell
  primitives (`index.tsx`, `app-sidebar.tsx`, `site-header.tsx`...) on purpose.
*/

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <m.div
      className={cn('flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5', className)}
      variants={rise}
    >
      {children}
    </m.div>
  );
}

export function ContentSkeleton() {
  return (
    <m.div
      animate="visible"
      aria-busy="true"
      aria-label="Loading content"
      className="@container/content flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6"
      initial="hidden"
      role="status"
      variants={list}
    >
      <m.div className="flex flex-col gap-2" variants={rise}>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full max-w-72" />
      </m.div>

      <div className="grid gap-4 @xl/content:grid-cols-2 @4xl/content:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Panel key={index}>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-24" />
          </Panel>
        ))}
      </div>

      <div className="grid flex-1 gap-4 @3xl/content:grid-cols-3">
        <Panel className="min-h-64 @3xl/content:col-span-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-56 max-w-full" />
          <Skeleton className="mt-2 w-full flex-1" />
        </Panel>
        <Panel>
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 5 }, (_, index) => (
            <div className="flex items-center gap-3" key={index}>
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </m.div>
  );
}
