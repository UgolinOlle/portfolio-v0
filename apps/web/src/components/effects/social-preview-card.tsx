'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import type { SocialPreview } from '~/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function SocialPreviewAvatar({ preview }: { preview: SocialPreview }) {
  if (preview.avatar) {
    return (
      <img
        alt={preview.name}
        className="h-9 w-9 shrink-0 rounded-full border border-primary/10 object-cover"
        src={preview.avatar}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
        'border border-primary/10 bg-primary-foreground text-xs font-medium text-primary/80',
      )}
    >
      {getInitials(preview.name)}
    </div>
  );
}

function SocialPreviewContent({ preview, icon }: { preview: SocialPreview; icon?: ReactNode }) {
  const subtitle = preview.role ?? preview.bio;
  const showBioSeparately = Boolean(preview.role && preview.bio);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2.5">
        <SocialPreviewAvatar preview={preview} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-primary">{preview.name}</p>
            {icon && <span className="h-3.5 w-3.5 shrink-0 opacity-70">{icon}</span>}
          </div>
          {preview.handle && <p className="truncate text-xs text-primary/50">{preview.handle}</p>}
        </div>
      </div>

      {subtitle && <p className="mt-2 text-xs text-primary/70">{subtitle}</p>}
      {showBioSeparately && <p className="mt-1 text-xs text-primary/50">{preview.bio}</p>}

      {preview.stats && preview.stats.length > 0 && (
        <div className="mt-2 flex gap-3 border-t border-primary/10 pt-2">
          {preview.stats.map((stat) => (
            <div className="flex items-baseline gap-1" key={stat.label}>
              <span className="text-xs font-medium text-primary">{stat.value}</span>
              <span className="text-[11px] text-primary/50">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

type SocialPreviewCardProps = {
  preview: SocialPreview;
  icon?: ReactNode;
  /** Top-left position in pixels, relative to the nearest positioned ancestor. */
  left: number;
  top: number;
  /** Horizontal offset (px, from the card's left edge) the pointer arrow should sit at. */
  arrowLeft: number;
  className?: string;
};

function SocialPreviewCard({
  preview,
  icon,
  left,
  top,
  arrowLeft,
  className,
}: SocialPreviewCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={cn('absolute z-50 w-64', className)}
      exit={{ opacity: 0, scale: 0.96 }}
      initial={{ opacity: 0, scale: 0.96 }}
      layout="position"
      style={{ left, top }}
      transition={{
        duration: 0.16,
        ease: 'easeOut',
        layout: { type: 'spring', stiffness: 420, damping: 34 },
      }}
    >
      <div
        aria-hidden
        className={cn(
          'absolute -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45',
          'border-t border-l border-primary/10 bg-background/90',
          'transition-[left] duration-200 ease-out',
        )}
        style={{ left: arrowLeft }}
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-primary/10 bg-background/90 p-3',
          'shadow-xl backdrop-blur-md',
        )}
      >
        <AnimatePresence mode="wait">
          <SocialPreviewContent
            icon={icon}
            key={preview.handle ?? preview.name}
            preview={preview}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export { SocialPreviewCard };
