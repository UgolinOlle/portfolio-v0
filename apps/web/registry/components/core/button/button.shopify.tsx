'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const shopifyButtonVariants = cva(
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
          'border border-[#1f1f1f]',
          'bg-gradient-to-b from-[#3a3a3a] to-[#2f2f2f]',
          'text-white',

          'shadow-[0_1px_0_rgba(255,255,255,.12)_inset,0_1px_2px_rgba(0,0,0,.25),0_0_0_1px_rgba(0,0,0,.35)]',

          'hover:from-[#404040] hover:to-[#343434]',
          'active:translate-y-px',
        ),

        primary: cn(
          'border border-primary/40',
          'bg-gradient-to-b from-primary to-primary/80',
          'text-primary-foreground',

          'shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_2px_6px_rgba(0,0,0,.25)]',

          'hover:brightness-110',
          'active:translate-y-px',
        ),

        secondary: cn(
          'border border-border',
          'bg-gradient-to-b from-secondary to-secondary/80',
          'text-secondary-foreground',

          'shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_2px_5px_rgba(0,0,0,.12)]',

          'hover:brightness-105',
          'active:translate-y-px',
        ),

        destructive: cn(
          'border border-red-950/40',
          'bg-gradient-to-b from-red-500 to-red-600',
          'text-white',

          'shadow-[0_1px_0_rgba(255,255,255,.2)_inset,0_2px_6px_rgba(0,0,0,.25)]',

          'hover:from-red-400 hover:to-red-500',
          'active:translate-y-px',
        ),

        outline: cn(
          'border border-border',
          'bg-background',
          'text-foreground',

          'shadow-[0_1px_0_rgba(255,255,255,.1)_inset,0_2px_5px_rgba(0,0,0,.08)]',

          'hover:bg-accent',
          'active:translate-y-px',
        ),

        ghost: cn(
          'border border-transparent',
          'bg-transparent',
          'text-foreground',

          'hover:bg-accent',
          'active:translate-y-px',
        ),

        success: cn(
          'border border-emerald-700/40',
          'bg-gradient-to-b from-emerald-500 to-emerald-600',
          'text-white',

          'shadow-[0_1px_0_rgba(255,255,255,.2)_inset,0_2px_6px_rgba(0,0,0,.25)]',

          'hover:from-emerald-400 hover:to-emerald-500',
          'active:translate-y-px',
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

export interface ShopifyButtonProps
  extends NativeButtonProps, VariantProps<typeof shopifyButtonVariants> {
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

export function ShopifyButton({
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
}: ShopifyButtonProps) {
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
    shopifyButtonVariants({
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
