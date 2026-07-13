'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => (
  <ThemeSwitch
    className={cn(
      'border-fd-border hover:bg-fd-accent h-8 gap-0.5 bg-transparent p-1 transition-colors',
      className,
    )}
  />
);
