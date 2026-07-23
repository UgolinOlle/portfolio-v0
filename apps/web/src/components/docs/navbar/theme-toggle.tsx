'use client';

import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { useTheme } from 'next-themes';

import { cn } from '~/lib/cn';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const updateTheme = () => {
      setTheme(nextTheme);
    };

    if (!document.startViewTransition) {
      updateTheme();
      return;
    }

    document.startViewTransition(updateTheme);
  };

  return (
    <ThemeSwitch
      className={cn(
        'border-fd-border hover:bg-fd-accent h-8 gap-0.5 bg-transparent p-1 transition-colors',
        className,
      )}
      onClick={toggleTheme}
    />
  );
};
