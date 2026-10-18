import { cn } from '@/lib/utils';

const palette = [
  'bg-sky-200 text-sky-900',
  'bg-amber-200 text-amber-900',
  'bg-emerald-200 text-emerald-900',
  'bg-rose-200 text-rose-900',
  'bg-violet-200 text-violet-900',
  'bg-teal-200 text-teal-900',
];

function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      aria-label={name}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white select-none',
        palette[hash(name) % palette.length],
        className,
      )}
      role="img"
    >
      {initials}
    </span>
  );
}
