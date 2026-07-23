'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import { CheckIcon, CopyIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

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

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn('gap-2', className)}
      onClick={handleCopy}
      size={size}
      variant={variant}
      {...props}
    >
      <Icon size={14} />
      {isCopied ? copiedLabel : label}
    </Button>
  );
};
