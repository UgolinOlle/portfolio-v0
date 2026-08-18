'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion } from 'motion/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { CheckIcon, CopyIcon } from '~/components/icons/ui';

type CopyButtonProps = Omit<ComponentProps<typeof Button>, 'onClick' | 'children'> & {
  // Valeur copiée dans le presse-papiers au clic, quelle que soit son origine (commande CLI,
  // code source d'un registry item...).
  value: string;
  label?: string;
  copiedLabel?: string;
  timeout?: number;
};

export const CopyButton = ({
  value,
  label = 'Copier',
  copiedLabel = 'Copié !',
  timeout = 2000,
  className,
  variant = 'outline',
  size = 'sm',
  ...props
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), timeout);
    });
  };

  return (
    <Button
      className={cn('gap-2', className)}
      onClick={handleCopy}
      size={size}
      variant={variant}
      {...props}
    >
      <AnimatePresence initial={false} mode="wait">
        {isCopied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="inline-flex"
          >
            <CheckIcon size={14} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="inline-flex"
          >
            <CopyIcon size={14} />
          </motion.span>
        )}
      </AnimatePresence>
      {isCopied ? copiedLabel : label}
    </Button>
  );
};
