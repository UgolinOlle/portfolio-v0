'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const gandiButtonVariants = cva(
  cn(
    'group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
    'rounded-[var(--radius)] text-xs font-medium whitespace-nowrap transition-all duration-200 outline-none sm:text-sm',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    "[&_svg:not([class*='size-'])]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border border-slate-300',
          'bg-white text-slate-950',

          'shadow-[0_2px_0_rgba(15,23,42,0.08),0_6px_12px_-4px_rgba(15,23,42,0.18)]',

          'hover:border-slate-400',
          'hover:bg-slate-50',
          'hover:shadow-[0_3px_0_rgba(15,23,42,0.08),0_8px_16px_-6px_rgba(15,23,42,0.2)]',

          'active:translate-y-[2px]',
          'active:shadow-[0_1px_0_rgba(15,23,42,0.12)]',
        ),

        primary: cn(
          'border border-primary/40',
          'bg-primary text-primary-foreground',

          'shadow-[0_2px_0_rgba(15,23,42,0.12),0_6px_14px_-4px_rgba(0,0,0,.2)]',

          'hover:brightness-105',
          'active:translate-y-[2px]',
        ),

        secondary: cn(
          'border border-slate-300',
          'bg-slate-100 text-slate-900',

          'shadow-[0_2px_0_rgba(15,23,42,0.08),0_5px_10px_-4px_rgba(15,23,42,0.15)]',

          'hover:bg-slate-200',
          'active:translate-y-[2px]',
        ),

        destructive: cn(
          'border border-red-300',
          'bg-red-500 text-white',

          'shadow-[0_2px_0_rgba(127,29,29,.2),0_6px_12px_-4px_rgba(239,68,68,.35)]',

          'hover:bg-red-600',
          'active:translate-y-[2px]',
        ),

        success: cn(
          'border border-emerald-300',
          'bg-emerald-500 text-white',

          'shadow-[0_2px_0_rgba(6,78,59,.2),0_6px_12px_-4px_rgba(16,185,129,.35)]',

          'hover:bg-emerald-600',
          'active:translate-y-[2px]',
        ),

        warning: cn(
          'border border-amber-300',
          'bg-amber-400 text-amber-950',

          'shadow-[0_2px_0_rgba(120,53,15,.15),0_6px_12px_-4px_rgba(245,158,11,.35)]',

          'hover:bg-amber-300',
          'active:translate-y-[2px]',
        ),

        outline: cn(
          'border border-slate-300',
          'bg-white text-slate-950',

          'shadow-[0_2px_0_rgba(15,23,42,0.08),0_6px_12px_-4px_rgba(15,23,42,0.18)]',

          'hover:bg-slate-50',
          'active:translate-y-[2px]',
        ),

        ghost: cn(
          'border border-transparent',
          'bg-transparent text-slate-950',

          'hover:bg-slate-100',

          'active:translate-y-[1px]',
        ),
      },

      size: {
        default:
          'h-8 gap-1.5 px-2.5 text-xs sm:text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-[0.7rem] sm:text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-xs sm:text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 text-sm sm:text-base has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type MotionButtonProps = Omit<HTMLMotionProps<'button'>, 'children'>;

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface GandiButtonProps
  extends NativeButtonProps, VariantProps<typeof gandiButtonVariants> {
  asChild?: boolean;

  leadingIcon?: React.ReactNode;

  trailingIcon?: React.ReactNode;

  loading?: boolean;
}

const motionOnlyProps = [
  'whileTap',
  'whileHover',
  'whileFocus',
  'whileDrag',
  'drag',
  'layout',
  'transition',
  'initial',
  'animate',
  'exit',
];

function removeMotionProps(props: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !motionOnlyProps.includes(key)),
  );
}

export function GandiButton({
  className,
  variant,
  size,
  asChild = false,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  ...props
}: GandiButtonProps) {
  const isDisabled = Boolean(disabled) || loading;

  const leading = leadingIcon ? (
    <span
      data-icon="inline-start"
      className={cn('inline-flex shrink-0 items-center', loading && 'opacity-0')}
    >
      {leadingIcon}
    </span>
  ) : null;

  const trailing = trailingIcon ? (
    <span
      data-icon="inline-end"
      className={cn('inline-flex shrink-0 items-center', loading && 'opacity-0')}
    >
      {trailingIcon}
    </span>
  ) : null;

  const content = (
    <>
      {leading}

      <span className={cn(loading && 'opacity-0')}>{children}</span>

      {trailing}

      {loading && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle className="size-4 animate-spin" />
        </span>
      )}
    </>
  );

  const classNames = cn(
    gandiButtonVariants({
      variant,
      size,
    }),
    className,
  );

  if (asChild) {
    const slotProps = {
      ...props,
      disabled: isDisabled,
      'aria-disabled': isDisabled || undefined,
      'aria-busy': loading || undefined,
    };

    return (
      <Slot className={classNames} {...(slotProps as React.ComponentPropsWithoutRef<'button'>)}>
        {content}
      </Slot>
    );
  }

  const motionProps = removeMotionProps(props as Record<string, unknown>) as MotionButtonProps;

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={classNames}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
