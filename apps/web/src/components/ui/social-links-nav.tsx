'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { SocialPreviewCard } from '~/components/ui/social-preview-card';
import { TextHoverEnter } from '~/components/ui/text-hover';
import { useMediaQuery } from '~/hooks/use-media-query';
import type { SocialLink } from '~/types';

const HOVER_OPEN_DELAY = 350;
const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const CARD_WIDTH = 256;
const CARD_GAP = 12;
const EDGE_PADDING = 8;
const ARROW_PADDING = 16;

function SocialLinkIcon({
  link,
  currentTheme,
}: {
  link: SocialLink;
  currentTheme: string | undefined;
}) {
  const Icon = currentTheme === 'dark' && link.iconDark ? link.iconDark : link.icon;

  if (Icon) {
    return <Icon className="h-4 w-4" />;
  }

  if (link.favicon) {
    return (
      <Image
        src={link.favicon}
        alt={`${link.label} icon`}
        width={16}
        height={16}
        className="h-4 w-4"
        loading="lazy"
      />
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

function SocialLinksNav({
  links,
  currentTheme,
}: {
  links: SocialLink[];
  currentTheme: string | undefined;
}) {
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
              'border border-primary/20 transition-all duration-300 hover:bg-primary-foreground',
              'active:scale-[0.95]',
            )}
            rel="noopener noreferrer"
            target="_blank"
            href={link.link}
          >
            <SocialLinkIcon currentTheme={currentTheme} link={link} />
            <TextHoverEnter className="text-sm">{link.label}</TextHoverEnter>
          </Link>
        </div>
      ))}

      {isDesktop && (
        <AnimatePresence>
          {activeLink?.preview && position && (
            <SocialPreviewCard
              arrowLeft={position.arrowLeft}
              icon={<SocialLinkIcon currentTheme={currentTheme} link={activeLink} />}
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
