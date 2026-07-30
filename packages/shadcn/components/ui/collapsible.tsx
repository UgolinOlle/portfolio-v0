'use client';

import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils';

export const Collapsible = Primitive.Root;

export const CollapsibleTrigger = Primitive.Trigger;

export function CollapsibleContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Primitive.Panel>) {
  return (
    <Primitive.Panel
      {...props}
      className={(s) =>
        cn(
          "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 [&[hidden]:not([hidden='until-found'])]:hidden",
          typeof className === 'function' ? className(s) : className,
        )
      }
    >
      {children}
    </Primitive.Panel>
  );
}

export type CollapsibleProps = Primitive.Root.Props;
export type CollapsibleContentProps = Primitive.Panel.Props;
export type CollapsibleTriggerProps = Primitive.Trigger.Props;
