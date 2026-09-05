'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { Spotlight } from '~/components/ui/spotlight';
import { TextHoverEnter } from '~/components/ui/text-hover';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { RESOURCES } from '~/lib/data';
import type { Resources } from '~/types';

const DEFAULT_VISIBLE_RESOURCES = 4;
const BLUR_CUTOFF_INDEX = 3;
const FILTER_BUTTON_BASE_DELAY = 0.3;
const FILTER_BUTTON_DELAY_MULTIPLIER = 0.05;
const SLIDE_ANIMATION_DISTANCE = 50;

function ResourceItem({
  resource,
  index,
  showAll,
  filteredResourcesLength,
  direction,
  selectedType,
  hoveredResource,
  setHoveredResource,
  isTouchDevice,
}: {
  resource: Resources;
  index: number;
  showAll: boolean;
  filteredResourcesLength: number;
  direction: number;
  selectedType: string;
  hoveredResource: string | null;
  setHoveredResource: (name: string | null) => void;
  isTouchDevice: boolean;
}) {
  const isBlurred =
    !showAll && index === BLUR_CUTOFF_INDEX && filteredResourcesLength > DEFAULT_VISIBLE_RESOURCES;

  const renderIcon = () => {
    if (resource.icon) {
      if (typeof resource.icon === 'function') {
        const IconComponent = resource.icon as React.ComponentType<{
          className?: string;
        }>;

        return <IconComponent className="h-6 w-6" />;
      }

      return resource.icon;
    }

    if (resource.url) {
      return (
        <img
          alt={resource.name}
          className="h-6 w-6 rounded object-cover"
          height={24}
          src={resource.url}
          width={24}
        />
      );
    }

    return null;
  };

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl bg-zinc-300/30 p-px dark:bg-zinc-600/30',
        isBlurred && 'pointer-events-none overflow-hidden',
      )}
      exit={{
        opacity: 0,
        x: direction > 0 ? -SLIDE_ANIMATION_DISTANCE : SLIDE_ANIMATION_DISTANCE,
      }}
      initial={{
        opacity: 0,
        x: direction > 0 ? SLIDE_ANIMATION_DISTANCE : -SLIDE_ANIMATION_DISTANCE,
      }}
      key={resource.name + selectedType}
      layout
      onMouseEnter={() => {
        if (!isTouchDevice) {
          setHoveredResource(resource.name);
        }
      }}
      onMouseLeave={() => {
        if (!isTouchDevice) {
          setHoveredResource(null);
        }
      }}
      style={
        isBlurred
          ? {
              filter: 'blur(4px)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0) 100%)',
              // biome-ignore lint/style/useNamingConvention: need for animation
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0) 100%)',
            }
          : undefined
      }
      transition={{ duration: 0.2 }}
    >
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative h-full w-full bg-white p-4 dark:bg-zinc-950">
        <div className="flex justify-between">
          <div className="flex w-full items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              layout
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{
                  width:
                    hoveredResource === resource.name && (resource.icon || resource.url) ? 24 : 0,
                  opacity:
                    hoveredResource === resource.name && (resource.icon || resource.url) ? 1 : 0,
                }}
                className="flex items-center overflow-hidden"
                initial={false}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {(resource.icon || resource.url) && (
                  <div className="h-6 w-6 shrink-0">{renderIcon()}</div>
                )}
              </motion.div>
              <motion.h4
                className="font-sans font-normal dark:text-zinc-100"
                layout
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {resource.name}
              </motion.h4>
            </motion.div>
            <p
              className="rounded-md px-2 font-mono text-sm text-zinc-500 dark:text-zinc-400"
              style={{
                backgroundColor: `${resource.color}20`,
                border: `1px solid ${resource.color}`,
              }}
            >
              {resource.type}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ResourcesSection() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [prevFilterIndex, setPrevFilterIndex] = useState(0);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  const types = useMemo(() => {
    const resourceTypes = Array.from(new Set(RESOURCES.map((r) => r.type)));
    const translatedTypes = resourceTypes.map((type) => t(`resources.types.${type}`));
    return [t('resources.filterAll'), ...translatedTypes];
  }, [t]);

  useEffect(() => {
    if (!selectedType) {
      setSelectedType(t('resources.filterAll'));
    }
  }, [selectedType, t]);

  const selectedFilterIndex = types.indexOf(selectedType);
  const direction = selectedFilterIndex > prevFilterIndex ? 1 : -1;

  const filteredResources = useMemo(() => {
    if (selectedType === t('resources.filterAll')) {
      return RESOURCES;
    }

    // Find the original type that corresponds to the selected translated type
    const resourceTypes = Array.from(new Set(RESOURCES.map((r) => r.type)));
    const originalType = resourceTypes.find(
      (type) => t(`resources.types.${type}`) === selectedType,
    );

    return originalType ? RESOURCES.filter((r) => r.type === originalType) : RESOURCES;
  }, [selectedType, t]);

  const displayedResources = showAll
    ? filteredResources
    : filteredResources.slice(0, DEFAULT_VISIBLE_RESOURCES);

  return (
    <motion.section
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      className="space-y-6"
    >
      <h3 className="text-lg">{t('resources.title')}</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {types.map((type, index) => (
          <motion.button
            className={cn(
              'group rounded-full border px-3 py-1 transition-colors',
              selectedType === type
                ? 'bg-primary-foreground text-primary'
                : 'border-zinc-300 text-primary/50 hover:bg-primary-foreground',
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            key={type}
            onClick={() => {
              setPrevFilterIndex(selectedFilterIndex);
              setSelectedType(type);
              setShowAll(false);
            }}
            transition={{
              duration: 0.3,
              delay: FILTER_BUTTON_BASE_DELAY + index * FILTER_BUTTON_DELAY_MULTIPLIER,
              ease: 'easeOut',
            }}
            type="button"
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            <TextHoverEnter className="text-sm">{type}</TextHoverEnter>
          </motion.button>
        ))}
      </div>

      <section
        aria-label="Liste des ressources filtrées"
        className="relative flex flex-col space-y-2 overflow-visible"
        onMouseLeave={() => {
          if (!isTouchDevice) {
            setHoveredResource(null);
          }
        }}
        ref={containerRef}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {displayedResources.map((resource, index) => (
            <ResourceItem
              direction={direction}
              filteredResourcesLength={filteredResources.length}
              hoveredResource={hoveredResource}
              index={index}
              isTouchDevice={isTouchDevice}
              key={resource.name + selectedType}
              resource={resource}
              selectedType={selectedType}
              setHoveredResource={setHoveredResource}
              showAll={showAll}
            />
          ))}
        </AnimatePresence>

        {filteredResources.length > DEFAULT_VISIBLE_RESOURCES && (
          <motion.button
            className="mt-1 self-start text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            layout
            onClick={() => setShowAll(!showAll)}
            transition={{ duration: 0.2, type: 'spring', bounce: 0.1 }}
          >
            {showAll ? t('resources.showLess') : t('resources.showMore')}
          </motion.button>
        )}
      </section>
    </motion.section>
  );
}
