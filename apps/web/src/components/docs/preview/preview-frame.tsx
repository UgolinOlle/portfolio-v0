import { cn } from '@portfolio-v0/shadcn/utils';

import type { ReactNode } from 'react';

type PreviewFrameProps = {
  children: ReactNode;
};

export const PreviewFrame = ({ children }: PreviewFrameProps) => {
  return (
    <div
      className={cn(
        'relative flex size-full flex-col items-center justify-center gap-4 overflow-auto bg-muted/20 p-10 sm:p-16',
        '[--primary-foreground:oklch(0.985_0_0)] [--primary:oklch(0.205_0_0)]',
        'dark:[--primary-foreground:oklch(0.205_0_0)] dark:[--primary:oklch(0.985_0_0)]',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          'bg-[radial-gradient(color-mix(in_oklch,var(--color-foreground)_18%,transparent)_1px,transparent_1px)]',
          'bg-size-[20px_20px]',
          'mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,black_40%,transparent_100%)]',
        )}
      />

      <div className="relative flex flex-col items-center gap-4 p-1">{children}</div>
    </div>
  );
};
