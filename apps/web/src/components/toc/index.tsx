'use client';
import { cn } from '@portfolio-v0/shadcn/utils';

import * as Primitive from 'fumadocs-core/toc';
import { type ComponentProps, createContext, use, useRef } from 'react';

import { mergeRefs } from '~/lib/merge-refs';

const TOCContext = createContext<Primitive.TOCItemType[]>([]);

export function useTOCItems(): Primitive.TOCItemType[] {
  return use(TOCContext);
}

export type TOCProviderProps = Primitive.AnchorProviderProps;

export const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;

export function TOCProvider({ toc, children, ...props }: TOCProviderProps) {
  return (
    <TOCContext value={toc}>
      <Primitive.AnchorProvider toc={toc} {...props}>
        {children}
      </Primitive.AnchorProvider>
    </TOCContext>
  );
}

export function TOCScrollArea({ ref, className, ...props }: ComponentProps<'div'>) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mergeRefs(viewRef, ref)}
      className={cn(
        'relative min-h-0 overflow-x-clip overflow-y-auto mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3 text-sm [scrollbar-width:none]',
        className,
      )}
      {...props}
    >
      <Primitive.ScrollProvider containerRef={viewRef}>{props.children}</Primitive.ScrollProvider>
    </div>
  );
}
