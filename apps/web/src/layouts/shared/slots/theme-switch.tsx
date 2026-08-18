'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useTranslations } from '@fuma-translate/react';
import { cva } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { type ComponentProps, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { SunMoonIcon } from '~/components/icons/ui';

const itemVariants = cva('size-6 p-1 text-fd-muted-foreground', {
  variants: {
    active: {
      true: 'text-fd-accent-foreground',
      false: 'text-fd-muted-foreground',
    },
  },
});

export type ThemeSwitchProps = ComponentProps<'button'>;

export function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations({ note: 'theme switcher' });

  const handleThemeChange = (newTheme: string) => {
    if (document?.startViewTransition) {
      document.startViewTransition(() => flushSync(() => setTheme(newTheme)));
    } else {
      setTheme(newTheme);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? resolvedTheme : null;

  return (
    <button
      className={cn(
        'inline-flex items-center overflow-hidden rounded-full border p-1 *:rounded-full',
        className,
      )}
      aria-label={t('Toggle Theme', { note: 'aria-label' })}
      onClick={() => handleThemeChange(value === 'light' ? 'dark' : 'light')}
      data-theme-toggle=""
      {...props}
    >
      <span className={cn(itemVariants({ active: true }))}>
        <SunMoonIcon className="size-full" fill="currentColor" />
      </span>
    </button>
  );
}
