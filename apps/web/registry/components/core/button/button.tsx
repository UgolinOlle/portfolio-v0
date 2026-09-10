'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
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
        default: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',

        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',

        ghost: 'hover:bg-accent hover:text-accent-foreground',

        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',

        success: 'bg-emerald-600 text-white shadow-sm hover:opacity-90',

        warning: 'bg-amber-400 text-amber-950 shadow-sm hover:opacity-90',

        purple: cn(
          'border border-violet-400/30',
          'bg-gradient-to-b from-violet-500 to-violet-600',
          'text-white',

          'shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_4px_14px_-2px_rgba(139,92,246,.55)]',

          'hover:from-violet-400 hover:to-violet-500',
          'active:translate-y-px',
        ),

        shine: cn(
          'overflow-hidden bg-primary text-primary-foreground',
          'before:absolute before:inset-0',
          'before:-translate-x-full',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          'before:transition-transform before:duration-700',
          'hover:before:translate-x-full',
        ),

        link: cn(
          'h-auto rounded-none p-0',
          'text-primary',
          'underline-offset-4',
          'hover:underline',
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

export interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonVariants> {
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

export function Button({
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
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;

  const leading = leadingIcon ? (
    <span
      data-icon="inline-start"
      className={cn('inline-flex shrink-0 items-center', loading && 'opacity-0')}
    >
      {leadingIcon}
    </span>
  ) : null;

  const isLinkArrow = variant === 'link' && !trailingIcon;

  const trailing = isLinkArrow ? (
    <ArrowUpRight
      data-icon="inline-end"
      className={cn(
        'size-4',
        'translate-x-0 opacity-0',
        'transition-all duration-200',
        'group-hover:translate-x-1',
        'group-hover:-translate-y-1',
        'group-hover:opacity-100',
        loading && '!opacity-0',
      )}
    />
  ) : trailingIcon ? (
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
    buttonVariants({
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
