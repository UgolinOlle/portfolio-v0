import { siteConfig } from '~/lib/metadata';

export const GITHUB_REPO = 'ugolinolle/portfolio-v0';

export const WEBSITE_URL = siteConfig.url;
export const EMAIL = siteConfig.email;

export const VARIANTS_SECTION = {
  // No `filter: blur()`: animating it repaints every frame and stutters on low-end phones.
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/** Strong ease-out: the built-in `easeOut` is too weak for entrances. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const TRANSITION_SECTION = {
  duration: 0.4,
  ease: EASE_OUT,
};

/** Spread on a section: it reveals itself once, when it scrolls into view (not on page mount). */
export const SECTION_REVEAL = {
  variants: VARIANTS_SECTION,
  transition: TRANSITION_SECTION,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
} as const;

/** Children of a revealed list: parent-driven, 50 ms apart. */
export const VARIANTS_LIST = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/** Same trigger, for a section whose items animate instead of the section itself. */
export const SECTION_REVEAL_LIST = { ...SECTION_REVEAL, variants: VARIANTS_LIST } as const;
