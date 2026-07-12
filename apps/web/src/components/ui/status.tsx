import { cn } from '@portfolio-v0/shadcn/utils';

export type StatusType = 'online' | 'dnd';

type StatusProps = {
  status: StatusType;
};

export function Status({ status }: StatusProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1 text-sm',
        'font-medium text-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200',
      )}
    >
      {status === 'online' ? 'Available' : 'Unavailable'}
      <span
        className={cn('h-2 w-2 rounded-full', status === 'online' ? 'bg-green-500' : 'bg-red-500')}
      />
    </span>
  );
}
