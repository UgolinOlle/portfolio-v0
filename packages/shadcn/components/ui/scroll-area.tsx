import { ScrollArea as Primitive } from '@base-ui/react/scroll-area';
import * as React from 'react';

import { cn } from '../../lib/utils';

export function ScrollArea({ children, ...props }: React.ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root {...props}>
      {children}
      <Primitive.Corner />
      <ScrollBar orientation="vertical" />
    </Primitive.Root>
  );
}

export function ScrollViewport({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport
      className={(s) =>
        cn(
          'size-full rounded-[inherit]',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    >
      {children}
    </Primitive.Viewport>
  );
}

export function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Primitive.Scrollbar>) {
  return (
    <Primitive.Scrollbar
      orientation={orientation}
      className={(s) =>
        cn(
          'flex transition-opacity select-none',
          !s.hovering && 'opacity-0',
          orientation === 'vertical' && 'h-full w-1.5',
          orientation === 'horizontal' && 'h-1.5 flex-col',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    >
      <Primitive.Thumb className="bg-fd-border relative flex-1 rounded-full" />
    </Primitive.Scrollbar>
  );
}

export type ScrollAreaProps = Primitive.Root.Props;
