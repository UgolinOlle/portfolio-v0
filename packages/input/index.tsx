'use client';

import { Check, X, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'filled' | 'ghost';

type InputStatus = 'idle' | 'success' | 'error';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;

  loading?: boolean;

  status?: InputStatus;

  errorMessage?: string;

  clearable?: boolean;
}

const variants = {
  default: [
    'border-input',
    'bg-background',
    'focus-within:border-primary',
    'focus-within:ring-primary/20',
  ].join(' '),

  filled: [
    'border-transparent',
    'bg-muted',
    'focus-within:bg-background',
    'focus-within:border-primary',
  ].join(' '),

  ghost: ['border-transparent', 'bg-transparent', 'hover:bg-muted', 'focus-within:bg-muted'].join(
    ' ',
  ),
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,

      variant = 'default',

      leftIcon,

      rightIcon,

      loading = false,

      status = 'idle',

      errorMessage,

      clearable = false,

      value,

      onChange,

      disabled,

      ...props
    },
    ref,
  ) => {
    const hasValue = value !== undefined && String(value).length > 0;

    const handleClear = () => {
      onChange?.({
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="w-full space-y-1">
        <motion.div
          animate={
            status === 'error'
              ? {
                  x: [0, -8, 8, -6, 6, 0],
                }
              : {
                  x: 0,
                }
          }
          transition={{
            duration: 0.4,
          }}
          className={cn(
            'group flex h-10 w-full items-center gap-2 rounded-md border px-3 text-sm transition-all',

            'focus-within:ring-4',

            variants[variant],

            status === 'error' && ['border-destructive', 'ring-4', 'ring-destructive/20'],

            status === 'success' && ['border-green-500', 'ring-4', 'ring-green-500/20'],

            disabled && 'cursor-not-allowed opacity-50',

            className,
          )}
        >
          {/* LEFT ICON */}

          <AnimatePresence mode="popLayout">
            {leftIcon && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: -5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                className="
text-muted-foreground
"
              >
                {leftIcon}
              </motion.span>
            )}
          </AnimatePresence>

          {/* INPUT */}

          <input
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled || loading}
            className={cn(
              'flex-1 bg-transparent outline-none',

              'placeholder:text-muted-foreground',

              'disabled:cursor-not-allowed',
            )}
            {...props}
          />

          {/* LOADING */}

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                }}
              >
                <LoaderCircle
                  className="
size-4
animate-spin
text-muted-foreground
"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS / ERROR ICON */}

          <AnimatePresence mode="wait">
            {!loading && status === 'success' && (
              <motion.div
                key="success"
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  rotate: -90,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{
                  type: 'spring',

                  stiffness: 400,

                  damping: 15,
                }}
              >
                <Check
                  className="
size-4
text-green-500
"
                />
              </motion.div>
            )}

            {!loading && status === 'error' && (
              <motion.div
                key="error"
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  rotate: 90,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{
                  type: 'spring',

                  stiffness: 400,

                  damping: 15,
                }}
              >
                <X className="size-4 text-destructive" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {clearable && hasValue && !loading && status === 'idle' && (
              <motion.button
                type="button"
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                }}
                onClick={handleClear}
                className="text-muted-foreground transition hover:text-foreground"
              >
                <X className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* RIGHT ICON */}

          {!loading && status === 'idle' && rightIcon && (
            <motion.span
              initial={{
                opacity: 0,
                x: 5,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="text-muted-foreground"
            >
              {rightIcon}
            </motion.span>
          )}
        </motion.div>

        <AnimatePresence>
          {status === 'error' && errorMessage && (
            <motion.p
              initial={{
                opacity: 0,
                height: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -5,
              }}
              className="text-xs text-destructive"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = 'Input';
