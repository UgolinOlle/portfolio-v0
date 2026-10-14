import { siteConfig } from '~/lib/metadata';

export const WEBSITE_URL = siteConfig.url;
export const EMAIL = siteConfig.email;

// The container only staggers its children: fading it would hide the whole page until hydration.
export const VARIANTS_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const VARIANTS_SECTION = {
  // No `filter: blur()`: animating it repaints every frame and stutters on low-end phones.
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const TRANSITION_SECTION = {
  duration: 0.3,
};
