import { LoaderCircle } from 'lucide-react';

import { cn } from '../../lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={cn(
        'size-4 animate-[spin_0.8s_linear_infinite] motion-reduce:animate-pulse',
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
