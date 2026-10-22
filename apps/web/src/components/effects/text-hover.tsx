import { cn } from '@portfolio-v0/shadcn/utils';

type TextHoverEnterProps = {
  children: string;
  className?: string;
};

export function TextHoverEnter({ children, className }: TextHoverEnterProps) {
  if (typeof children !== 'string') {
    return null;
  }

  const letters = children.split('').map((l) => (l === ' ' ? '\u00A0' : l));
  const transitionDelay = 25;

  return (
    <div
      className={cn(
        'relative block overflow-hidden text-base font-medium whitespace-nowrap select-none',
        'text-foreground',
        className,
      )}
      style={{ lineHeight: 0.9 }}
    >
      <div aria-hidden className="flex py-0.5">
        {letters.map((letter, i) => (
          <span
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-80"
            key={`top-${i}`}
            style={{ transitionDelay: `${i * transitionDelay}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {letters.map((letter, i) => (
          <span
            className="inline-block translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0.5"
            key={`bottom-${i}`}
            style={{ transitionDelay: `${i * transitionDelay}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
