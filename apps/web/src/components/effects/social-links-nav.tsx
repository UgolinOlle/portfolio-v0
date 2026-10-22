'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { SocialPreviewCard } from '~/components/effects/social-preview-card';
import { TextHoverEnter } from '~/components/effects/text-hover';
import { useMediaQuery } from '~/hooks/use-media-query';
import type { SocialLink } from '~/types';

const HOVER_OPEN_DELAY = 350;
const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const CARD_WIDTH = 256;
const CARD_GAP = 12;
const EDGE_PADDING = 8;
const ARROW_PADDING = 16;

// Both variants are rendered and CSS picks one, so the markup doesn't depend on the theme
// (resolving it in JS made the server and client render different icons).
function SocialLinkIcon({ link }: { link: SocialLink }) {
  if (link.icon && link.iconDark) {
    const { icon: LightIcon, iconDark: DarkIcon } = link;

    return (
      <>
        <LightIcon className="h-4 w-4 dark:hidden" />
        <DarkIcon className="hidden h-4 w-4 dark:block" />
      </>
    );
  }

  if (link.icon) {
    return <link.icon className="h-4 w-4" />;
  }

  if (link.favicon) {
    return (
      <Image src={link.favicon} alt="" width={16} height={16} className="h-4 w-4" loading="lazy" />
    );
  }

  return null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type PreviewPosition = {
  left: number;
  top: number;
  arrowLeft: number;
};

function SocialLinksNav({ links }: { links: SocialLink[] }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [position, setPosition] = useState<PreviewPosition | null>(null);

  const measure = (label: string) => {
    const container = containerRef.current;
    const item = itemRefs.current.get(label);
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const iconCenterX = itemRect.left + itemRect.width / 2 - containerRect.left;
    const idealLeft = iconCenterX - CARD_WIDTH / 2;
    const maxLeft = Math.max(EDGE_PADDING, containerRect.width - CARD_WIDTH - EDGE_PADDING);
    const clampedLeft = clamp(idealLeft, EDGE_PADDING, maxLeft);

    setPosition({
      left: clampedLeft,
      top: itemRect.bottom - containerRect.top + CARD_GAP,
      arrowLeft: clamp(iconCenterX - clampedLeft, ARROW_PADDING, CARD_WIDTH - ARROW_PADDING),
    });
  };

  const clearOpenTimeout = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  const activateNow = (label: string) => {
    setActiveLabel(label);
    measure(label);
  };

  const handleItemHoverStart = (link: SocialLink) => {
    if (!isDesktop || !link.preview) return;
    clearOpenTimeout();

    if (activeLabel) {
      activateNow(link.label);
      return;
    }

    openTimeoutRef.current = setTimeout(() => activateNow(link.label), HOVER_OPEN_DELAY);
  };

  const handleNavHoverEnd = () => {
    clearOpenTimeout();
    setActiveLabel(null);
  };

  const activeLink = links.find((link) => link.label === activeLabel);

  return (
    <div
      className="relative my-1 grid w-fit grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-row md:items-center md:gap-3"
      onMouseLeave={handleNavHoverEnd}
      ref={containerRef}
    >
      {links.map((link) => (
        <div
          key={link.label}
          onMouseEnter={() => handleItemHoverStart(link)}
          ref={(node) => {
            if (node) {
              itemRefs.current.set(link.label, node);
            } else {
              itemRefs.current.delete(link.label);
            }
          }}
        >
          <Link
            className={cn(
              'group flex w-fit items-center gap-2 rounded-sm px-2 py-1 text-primary/80',
              'border border-primary/20 transition-[color,background-color,border-color,transform] duration-300 hover:bg-primary-foreground',
              'active:scale-[0.95]',
            )}
            rel="noopener noreferrer"
            target="_blank"
            href={link.link}
          >
            <SocialLinkIcon link={link} />
            <TextHoverEnter className="text-sm">{link.label}</TextHoverEnter>
          </Link>
        </div>
      ))}

      {isDesktop && (
        <AnimatePresence>
          {activeLink?.preview && position && (
            <SocialPreviewCard
              arrowLeft={position.arrowLeft}
              icon={<SocialLinkIcon link={activeLink} />}
              left={position.left}
              preview={activeLink.preview}
              top={position.top}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export { SocialLinksNav };
